#include "CityTwin.h"

#include "Camera/CameraComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Components/InputComponent.h"
#include "GameFramework/CharacterMovementComponent.h"

#include "Engine/Canvas.h"
#include "Engine/Engine.h"
#include "EngineUtils.h"

#include "Dom/JsonObject.h"
#include "Serialization/JsonReader.h"
#include "Serialization/JsonSerializer.h"

#include "Misc/FileHelper.h"
#include "Misc/Paths.h"


// --------------------------------------------------------------------------
// Feature actor
// --------------------------------------------------------------------------

ACityFeatureActor::ACityFeatureActor()
{
    PrimaryActorTick.bCanEverTick = false;

    Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
    SetRootComponent(Mesh);

    Mesh->SetMobility(EComponentMobility::Static);
    Mesh->SetCollisionProfileName(TEXT("BlockAll"));
}

void ACityFeatureActor::SetSelected(bool bSelected)
{
    Mesh->SetRenderCustomDepth(bSelected);
    Mesh->SetCustomDepthStencilValue(bSelected ? 1 : 0);

    // Custom depth is exposed for an optional outline post-process material.
    // The stock HUD also marks the selected building on the map.
}


// --------------------------------------------------------------------------
// First-person character
// --------------------------------------------------------------------------

ACityCharacter::ACityCharacter()
{
    FirstPersonCamera =
        CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));

    FirstPersonCamera->SetupAttachment(GetRootComponent());
    FirstPersonCamera->SetRelativeLocation(FVector(0, 0, 64));
    FirstPersonCamera->bUsePawnControlRotation = true;

    bUseControllerRotationYaw = true;

    GetCharacterMovement()->MaxWalkSpeed = 500.0f;
    GetCharacterMovement()->JumpZVelocity = 420.0f;
    GetCharacterMovement()->AirControl = 0.2f;
    GetCharacterMovement()->MaxStepHeight = 35.0f;
}

void ACityCharacter::SetupPlayerInputComponent(UInputComponent* Input)
{
    Super::SetupPlayerInputComponent(Input);

    Input->BindAxis("MoveForward", this, &ACityCharacter::MoveForward);
    Input->BindAxis("MoveRight", this, &ACityCharacter::MoveRight);
    Input->BindAxis("Turn", this, &ACityCharacter::Turn);
    Input->BindAxis("LookUp", this, &ACityCharacter::LookUp);

    Input->BindAction("Jump", IE_Pressed, this, &ACharacter::Jump);
    Input->BindAction("Jump", IE_Released, this, &ACharacter::StopJumping);
}

void ACityCharacter::MoveForward(float Value)
{
    if (!Controller || Controller->IsMoveInputIgnored()) return;

    const FRotator Rotation(0, Controller->GetControlRotation().Yaw, 0);
    AddMovementInput(
        FRotationMatrix(Rotation).GetUnitAxis(EAxis::X), Value
    );
}

void ACityCharacter::MoveRight(float Value)
{
    if (!Controller || Controller->IsMoveInputIgnored()) return;

    const FRotator Rotation(0, Controller->GetControlRotation().Yaw, 0);
    AddMovementInput(
        FRotationMatrix(Rotation).GetUnitAxis(EAxis::Y), Value
    );
}

void ACityCharacter::Turn(float Value)
{
    AddControllerYawInput(Value);
}

void ACityCharacter::LookUp(float Value)
{
    AddControllerPitchInput(Value);
}


// --------------------------------------------------------------------------
// Map HUD: index is independent of World Partition actor loading
// --------------------------------------------------------------------------

void ACityHUD::BeginPlay()
{
    Super::BeginPlay();
    LoadIndex();
}

void ACityHUD::LoadIndex()
{
    FString Json;
    const FString Filename =
        FPaths::ProjectContentDir() / TEXT("CityData/building_index.json");

    if (!FFileHelper::LoadFileToString(Json, *Filename))
    {
        UE_LOG(LogTemp, Error, TEXT("Missing building index: %s"), *Filename);
        return;
    }

    TSharedPtr<FJsonObject> Root;
    const TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Json);

    if (!FJsonSerializer::Deserialize(Reader, Root) || !Root.IsValid())
        return;

    const TArray<TSharedPtr<FJsonValue>>* Buildings = nullptr;
    if (!Root->TryGetArrayField(TEXT("buildings"), Buildings))
        return;

    bool bFirst = true;

    for (const TSharedPtr<FJsonValue>& Value : *Buildings)
    {
        const TSharedPtr<FJsonObject> Item = Value->AsObject();
        if (!Item.IsValid()) continue;

        const TArray<TSharedPtr<FJsonValue>>* Bounds = nullptr;
        if (!Item->TryGetArrayField(TEXT("bounds_enu_m"), Bounds)
            || Bounds->Num() != 4)
            continue;

        FCityMapRecord Record;
        Record.BuildingId = Item->GetStringField(TEXT("building_id"));
        Record.Name = Item->GetStringField(TEXT("name"));
        Record.AttributesJson =
            Item->GetStringField(TEXT("attributes_json"));

        Record.MinimumEnu = FVector2D(
            (*Bounds)[0]->AsNumber(), (*Bounds)[1]->AsNumber()
        );
        Record.MaximumEnu = FVector2D(
            (*Bounds)[2]->AsNumber(), (*Bounds)[3]->AsNumber()
        );

        if (bFirst)
        {
            MinimumEnu = Record.MinimumEnu;
            MaximumEnu = Record.MaximumEnu;
            bFirst = false;
        }
        else
        {
            MinimumEnu.X = FMath::Min(MinimumEnu.X, Record.MinimumEnu.X);
            MinimumEnu.Y = FMath::Min(MinimumEnu.Y, Record.MinimumEnu.Y);
            MaximumEnu.X = FMath::Max(MaximumEnu.X, Record.MaximumEnu.X);
            MaximumEnu.Y = FMath::Max(MaximumEnu.Y, Record.MaximumEnu.Y);
        }

        Records.Add(MoveTemp(Record));
    }
}

FVector2D ACityHUD::ProjectToMap(const FVector2D& Enu) const
{
    const FVector2D Extent = MaximumEnu - MinimumEnu;
    const double Scale = FMath::Min(
        MapSize.X / FMath::Max(Extent.X, 1.0),
        MapSize.Y / FMath::Max(Extent.Y, 1.0)
    );

    const FVector2D Used = Extent * Scale;
    const FVector2D Padding = (MapSize - Used) * 0.5;

    // Map north is screen-up, independently of imported UE axes.
    return MapOrigin + Padding + FVector2D(
        (Enu.X - MinimumEnu.X) * Scale,
        (MaximumEnu.Y - Enu.Y) * Scale
    );
}

const FCityMapRecord* ACityHUD::FindRecord(const FString& Id) const
{
    return Records.FindByPredicate(
        [&Id](const FCityMapRecord& Record)
        {
            return Record.BuildingId == Id;
        }
    );
}

FString ACityHUD::PickBuilding(const FVector2D& Position) const
{
    FString Best;
    double BestArea = TNumericLimits<double>::Max();

    for (const FCityMapRecord& Record : Records)
    {
        const FVector2D A = ProjectToMap(
            FVector2D(Record.MinimumEnu.X, Record.MaximumEnu.Y)
        );
        const FVector2D B = ProjectToMap(
            FVector2D(Record.MaximumEnu.X, Record.MinimumEnu.Y)
        );

        const FVector2D Center = (A + B) * 0.5;
        const FVector2D HalfSize(
            FMath::Max((B.X - A.X) * 0.5, 2.0),
            FMath::Max((B.Y - A.Y) * 0.5, 2.0)
        );

        if (FMath::Abs(Position.X - Center.X) <= HalfSize.X
            && FMath::Abs(Position.Y - Center.Y) <= HalfSize.Y)
        {
            const double Area = HalfSize.X * HalfSize.Y;
            if (Area < BestArea)
            {
                BestArea = Area;
                Best = Record.BuildingId;
            }
        }
    }

    return Best;
}

void ACityHUD::DrawHUD()
{
    Super::DrawHUD();
    if (!Canvas) return;

    ACityPlayerController* PC =
        Cast<ACityPlayerController>(GetOwningPlayerController());

    const float Width = FMath::Clamp(Canvas->SizeX * 0.30f, 240.0f, 460.0f);
    const float Height = FMath::Min(Width, Canvas->SizeY * 0.55f);

    MapOrigin = FVector2D(Canvas->SizeX - Width - 20, 42);
    MapSize = FVector2D(Width, Height);

    DrawRect(
        FLinearColor(0.025f, 0.035f, 0.045f, 0.9f),
        MapOrigin.X - 8, MapOrigin.Y - 28,
        MapSize.X + 16, MapSize.Y + 38
    );

    DrawText(
        TEXT("Hinjawadi | North up | Building envelopes"),
        FLinearColor::White,
        MapOrigin.X, MapOrigin.Y - 24,
        GEngine->GetSmallFont()
    );

    for (const FCityMapRecord& Record : Records)
    {
        const FVector2D A = ProjectToMap(
            FVector2D(Record.MinimumEnu.X, Record.MaximumEnu.Y)
        );
        const FVector2D B = ProjectToMap(
            FVector2D(Record.MaximumEnu.X, Record.MinimumEnu.Y)
        );

        const bool bSelected =
            PC && PC->SelectedBuildingId == Record.BuildingId;

        DrawRect(
            bSelected ? FLinearColor(1, 0.65f, 0.05f, 1)
                      : FLinearColor(0.4f, 0.62f, 0.7f, 0.8f),
            A.X, A.Y,
            FMath::Max(1.0, B.X - A.X),
            FMath::Max(1.0, B.Y - A.Y)
        );
    }

    DrawText(
        TEXT("WASD move | Mouse look | Space jump | Tab map | LMB select"),
        FLinearColor::White, 20, 20, GEngine->GetSmallFont()
    );

    DrawText(
        TEXT("OSM-derived approximation | © OpenStreetMap contributors"),
        FLinearColor(0.8f, 0.8f, 0.8f),
        20, Canvas->SizeY - 28, GEngine->GetSmallFont()
    );

    if (!PC) return;

    const FCityMapRecord* Selected = FindRecord(PC->SelectedBuildingId);
    if (!Selected) return;

    const float PanelWidth =
        FMath::Min(650.0f, static_cast<float>(Canvas->SizeX) - 40.0f);

    DrawRect(
        FLinearColor(0.02f, 0.025f, 0.03f, 0.92f),
        20, 60, PanelWidth, 255
    );

    DrawText(
        Selected->Name, FLinearColor::Yellow,
        32, 72, GEngine->GetMediumFont()
    );

    DrawText(
        Selected->BuildingId, FLinearColor::White,
        32, 103, GEngine->GetSmallFont()
    );

    TSharedPtr<FJsonObject> Attributes;
    auto Reader = TJsonReaderFactory<>::Create(Selected->AttributesJson);

    float Y = 130;

    if (FJsonSerializer::Deserialize(Reader, Attributes)
        && Attributes.IsValid())
    {
        const TCHAR* Keys[] = {
            TEXT("height_m"),
            TEXT("height_source"),
            TEXT("footprint_status"),
            TEXT("facade_status"),
            TEXT("reference_status"),
            TEXT("osm_id")
        };

        for (const TCHAR* Key : Keys)
        {
            const TSharedPtr<FJsonValue> Value = Attributes->TryGetField(Key);
            if (!Value.IsValid()) continue;

            FString Display;
            if (Value->Type == EJson::String)
                Display = Value->AsString();
            else if (Value->Type == EJson::Number)
                Display = FString::SanitizeFloat(Value->AsNumber());
            else
                continue;

            // Compact stock HUD: full JSON remains on the actor.
            const FString Line =
                (FString(Key) + TEXT(": ") + Display).Left(100);

            DrawText(
                Line, FLinearColor::White,
                32, Y, GEngine->GetSmallFont()
            );
            Y += 22;
        }
    }
}


// --------------------------------------------------------------------------
// Selection and input mode
// --------------------------------------------------------------------------

void ACityPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();

    InputComponent->BindAction(
        "ToggleMap", IE_Pressed,
        this, &ACityPlayerController::ToggleMapInteraction
    );

    InputComponent->BindAction(
        "Select", IE_Pressed,
        this, &ACityPlayerController::Click
    );
}

void ACityPlayerController::ToggleMapInteraction()
{
    bMapInteraction = !bMapInteraction;
    bShowMouseCursor = bMapInteraction;

    SetIgnoreLookInput(bMapInteraction);
    SetIgnoreMoveInput(bMapInteraction);

    if (bMapInteraction)
    {
        FInputModeGameAndUI Mode;
        Mode.SetHideCursorDuringCapture(false);
        SetInputMode(Mode);
    }
    else
    {
        SetInputMode(FInputModeGameOnly());
    }
}

void ACityPlayerController::Click()
{
    ACityHUD* CityHUD = Cast<ACityHUD>(GetHUD());

    if (bMapInteraction && CityHUD)
    {
        float X, Y;
        if (GetMousePosition(X, Y))
        {
            const FString Id = CityHUD->PickBuilding(FVector2D(X, Y));
            if (!Id.IsEmpty())
            {
                SelectBuilding(Id);
                return;
            }
        }
    }

    FHitResult Hit;

    if (bMapInteraction)
    {
        GetHitResultUnderCursor(ECC_Visibility, true, Hit);
    }
    else
    {
        FVector Location;
        FRotator Rotation;
        GetPlayerViewPoint(Location, Rotation);

        FCollisionQueryParams Params(SCENE_QUERY_STAT(CitySelection), true);
        Params.AddIgnoredActor(GetPawn());

        GetWorld()->LineTraceSingleByChannel(
            Hit,
            Location,
            Location + Rotation.Vector() * 200000.0,
            ECC_Visibility,
            Params
        );
    }

    if (ACityFeatureActor* Feature = Cast<ACityFeatureActor>(Hit.GetActor()))
    {
        if (!Feature->BuildingId.IsEmpty())
            SelectBuilding(Feature->BuildingId);
    }
}

void ACityPlayerController::SelectBuilding(const FString& Id)
{
    SelectedBuildingId = Id;

    // Selection is event-driven; this does not iterate the city every frame.
    for (TActorIterator<ACityFeatureActor> It(GetWorld()); It; ++It)
    {
        It->SetSelected(
            !Id.IsEmpty() && It->BuildingId == Id
        );
    }
}


// --------------------------------------------------------------------------
// Game mode
// --------------------------------------------------------------------------

ACityGameMode::ACityGameMode()
{
    DefaultPawnClass = ACityCharacter::StaticClass();
    PlayerControllerClass = ACityPlayerController::StaticClass();
    HUDClass = ACityHUD::StaticClass();
}
