using UnrealBuildTool;

public class HinjawadiTwinEditorTarget : TargetRules
{
    public HinjawadiTwinEditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        ExtraModuleNames.Add("HinjawadiTwin");
    }
}
