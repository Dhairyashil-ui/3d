using UnrealBuildTool;

public class HinjawadiTwinTarget : TargetRules
{
    public HinjawadiTwinTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        ExtraModuleNames.Add("HinjawadiTwin");
    }
}
