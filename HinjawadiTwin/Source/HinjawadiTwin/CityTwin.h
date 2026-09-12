#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "GameFramework/Character.h"
#include "GameFramework/HUD.h"
#include "GameFramework/PlayerController.h"
#include "GameFramework/GameModeBase.h"
#include "CityTwin.generated.h"

class UStaticMeshComponent;
class UCameraComponent;

UCLASS()
class HINJAWADITWIN_API ACityFeatureActor : public AActor
{
    GENERATED_BODY()

public:
    ACityFeatureActor();

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="City")
    TObjectPtr<UStaticMeshComponent> Mesh;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GIS")
    FString FeatureId;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GIS")
    FString BuildingId;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GIS")
    FString DisplayName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GIS")
    FString Category;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GIS")
    FString AttributesJson;

    // Original projected coordinates in metres, not Unreal centimetres.
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GIS")
    FVector EnuOriginMetres = FVector::ZeroVector;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GIS")
    bool bIsBuildingShell = false;

    UFUNCTION(BlueprintCallable, Category="City")
    void SetSelected(bool bSelected);
};


UCLASS()
class HINJAWADITWIN_API ACityCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    ACityCharacter();

protected:
    virtual void SetupPlayerInputComponent(
        UInputComponent* PlayerInputComponent
    ) override;

    UPROPERTY(VisibleAnywhere)
    TObjectPtr<UCameraComponent> FirstPersonCamera;

    void MoveForward(float Value);
    void MoveRight(float Value);
    void Turn(float Value);
    void LookUp(float Value);
};


struct FCityMapRecord
{
    FString BuildingId;
    FString Name;
    FString AttributesJson;
    FVector2D MinimumEnu = FVector2D::ZeroVector;
    FVector2D MaximumEnu = FVector2D::ZeroVector;
};


UCLASS()
class HINJAWADITWIN_API ACityHUD : public AHUD
{
    GENERATED_BODY()

public:
    virtual void BeginPlay() override;
    virtual void DrawHUD() override;

    FString PickBuilding(const FVector2D& ScreenPosition) const;
    const FCityMapRecord* FindRecord(const FString& BuildingId) const;

private:
    TArray<FCityMapRecord> Records;
    FVector2D MinimumEnu = FVector2D::ZeroVector;
    FVector2D MaximumEnu = FVector2D(1, 1);

    FVector2D MapOrigin = FVector2D::ZeroVector;
    FVector2D MapSize = FVector2D::ZeroVector;

    FVector2D ProjectToMap(const FVector2D& Enu) const;
    void LoadIndex();
};


UCLASS()
class HINJAWADITWIN_API ACityPlayerController : public APlayerController
{
    GENERATED_BODY()

public:
    virtual void SetupInputComponent() override;

    UPROPERTY(BlueprintReadOnly, Category="City")
    FString SelectedBuildingId;

    UPROPERTY(BlueprintReadOnly, Category="City")
    bool bMapInteraction = false;

    void SelectBuilding(const FString& BuildingId);

private:
    void ToggleMapInteraction();
    void Click();
};


UCLASS()
class HINJAWADITWIN_API ACityGameMode : public AGameModeBase
{
    GENERATED_BODY()

public:
    ACityGameMode();
};
