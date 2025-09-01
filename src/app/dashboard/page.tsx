import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Calendar, Users, Settings, Palette, Code, Zap } from "lucide-react"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarProvider>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              
              {/* Component Showcase Section */}
              <div className="px-4 lg:px-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Component Ecosystem Showcase</h2>
                  <p className="text-muted-foreground">
                    Complete shadcn/ui ecosystem with Tailwind CSS v4 and TypeScript integration
                  </p>
                </div>

                <Tabs defaultValue="components" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="forms">Forms</TabsTrigger>
                    <TabsTrigger value="navigation">Navigation</TabsTrigger>
                    <TabsTrigger value="themes">Themes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="components" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Button className="w-8 h-8 p-0" variant="outline">
                              <Zap className="w-4 h-4" />
                            </Button>
                            Buttons
                          </CardTitle>
                          <CardDescription>Interactive button components with variants</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm">Small</Button>
                            <Button>Default</Button>
                            <Button size="lg">Large</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline">Outline</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="destructive">Destructive</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Badge variant="outline">UI</Badge>
                            Badges
                          </CardTitle>
                          <CardDescription>Status and label indicators</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge>Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                            <Badge variant="outline">Outline</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback>UI</AvatarFallback>
                            </Avatar>
                            Avatars
                          </CardTitle>
                          <CardDescription>User profile images and fallbacks</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex gap-2">
                            <Avatar>
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <Avatar>
                              <AvatarFallback>AB</AvatarFallback>
                            </Avatar>
                            <Avatar>
                              <AvatarFallback>CD</AvatarFallback>
                            </Avatar>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Separator className="w-6 h-6" />
                            Separators
                          </CardTitle>
                          <CardDescription>Visual dividers and spacing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="space-y-2">
                            <div>Content above</div>
                            <Separator />
                            <div>Content below</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Switch />
                            Switches
                          </CardTitle>
                          <CardDescription>Toggle controls and settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="airplane-mode" />
                            <Label htmlFor="airplane-mode">Airplane Mode</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="wifi" defaultChecked />
                            <Label htmlFor="wifi">Wi-Fi</Label>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Checkbox />
                            Checkboxes
                          </CardTitle>
                          <CardDescription>Selection controls</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">Accept terms and conditions</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="marketing" defaultChecked />
                            <Label htmlFor="marketing">Send me marketing emails</Label>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="forms" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Form Components</CardTitle>
                        <CardDescription>Complete form building blocks</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Enter your name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Enter your email" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="guest">Guest</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" placeholder="Tell us about yourself" />
                        </div>

                        <div className="space-y-2">
                          <Label>Preferences</Label>
                          <RadioGroup defaultValue="light">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="light" id="light" />
                              <Label htmlFor="light">Light</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="dark" id="dark" />
                              <Label htmlFor="dark">Dark</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="system" id="system" />
                              <Label htmlFor="system">System</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="navigation" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Navigation Components</CardTitle>
                        <CardDescription>Menu and navigation patterns</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Calendar
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Users className="w-4 h-4 mr-2" />
                            Team
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="themes" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Theme System</CardTitle>
                        <CardDescription>CSS variables and color system</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Primary Colors</Label>
                            <div className="flex gap-2">
                              <div className="w-8 h-8 bg-primary rounded" />
                              <div className="w-8 h-8 bg-primary-foreground rounded border" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Accent Colors</Label>
                            <div className="flex gap-2">
                              <div className="w-8 h-8 bg-accent rounded" />
                              <div className="w-8 h-8 bg-accent-foreground rounded border" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </SidebarProvider>
  )
}
