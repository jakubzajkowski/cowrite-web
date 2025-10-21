import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardDrive, Cloud, ArrowRight, Check } from 'lucide-react';

interface WorkspaceTypeSelectorProps {
  onSelectLocal: () => void;
  onSelectCloud: () => void;
}

export const WorkspaceTypeSelector = ({
  onSelectLocal,
  onSelectCloud,
}: WorkspaceTypeSelectorProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Choose Your Workspace
          </h1>
          <p className="text-lg text-muted-foreground">
            Select where you want to store and manage your files
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Local Workspace Card */}
          <Card className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer group">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HardDrive className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                  Local Workspace
                  <span className="text-xs font-normal px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    Recommended
                  </span>
                </CardTitle>
                <CardDescription className="text-base">
                  Work with files directly on your device
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Full Control</p>
                    <p className="text-sm text-muted-foreground">
                      Complete access to your local file system
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Instant Access</p>
                    <p className="text-sm text-muted-foreground">
                      No internet required, work offline
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Privacy First</p>
                    <p className="text-sm text-muted-foreground">
                      Your files never leave your device
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">No Storage Limits</p>
                    <p className="text-sm text-muted-foreground">
                      Limited only by your device storage
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={onSelectLocal} className="w-full h-12 text-base group/btn" size="lg">
                Select Local Workspace
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Uses File System Access API
              </p>
            </CardContent>
          </Card>

          {/* Cloud Drive Card */}
          <Card className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer group">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                  Cloud Drive
                  <span className="text-xs font-normal px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                    New
                  </span>
                </CardTitle>
                <CardDescription className="text-base">
                  Store and sync files in the cloud
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Access Anywhere</p>
                    <p className="text-sm text-muted-foreground">
                      Work from any device with internet
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Auto Sync</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically backed up and synced
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Easy Sharing</p>
                    <p className="text-sm text-muted-foreground">
                      Share files with team members easily
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Version History</p>
                    <p className="text-sm text-muted-foreground">
                      Track changes and restore previous versions
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={onSelectCloud}
                className="w-full h-12 text-base group/btn"
                size="lg"
                variant="outline"
              >
                Select Cloud Drive
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">5GB free storage included</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            You can switch between workspace types at any time
          </p>
        </div>
      </div>
    </div>
  );
};
