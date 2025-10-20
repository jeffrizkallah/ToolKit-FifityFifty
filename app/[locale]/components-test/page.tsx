"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

/**
 * Components Test Page
 * 
 * This page showcases all shadcn/ui components integrated into the project.
 * It's used for testing RTL support, brand colors, and component functionality.
 * 
 * Access at: /en/components-test or /ar/components-test
 */

export default function ComponentsTestPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-neutral-dark">
          Component Library Showcase
        </h1>
        <p className="text-lg text-neutral-600">
          Testing shadcn/ui components with FiftyFifty brand colors and RTL support
        </p>
      </div>

      <Separator className="my-8" />

      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🚀</Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button disabled>Disabled Button</Button>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Cards Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area. You can put any content here.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With brand colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="w-full h-20 bg-brand-primary rounded-lg flex items-center justify-center text-white">
                  Primary
                </div>
                <div className="w-full h-20 bg-brand-secondary rounded-lg flex items-center justify-center text-white">
                  Secondary
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Semantic Colors</CardTitle>
              <CardDescription>Success, Warning, Error, Info</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="w-full h-12 bg-success rounded-lg flex items-center justify-center text-white text-sm">
                  Success
                </div>
                <div className="w-full h-12 bg-warning rounded-lg flex items-center justify-center text-white text-sm">
                  Warning
                </div>
                <div className="w-full h-12 bg-error rounded-lg flex items-center justify-center text-white text-sm">
                  Error
                </div>
                <div className="w-full h-12 bg-info rounded-lg flex items-center justify-center text-white text-sm">
                  Info
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Dialog Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description. Dialogs are used for important messages or actions.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-neutral-600">
                Dialog content goes here. You can put forms, confirmations, or any other content.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <Separator className="my-8" />

      {/* Tabs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Tabs</h2>
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tab 1 Content</CardTitle>
                <CardDescription>This is the content for the first tab</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab2" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tab 2 Content</CardTitle>
                <CardDescription>This is the content for the second tab</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab3" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tab 3 Content</CardTitle>
                <CardDescription>This is the content for the third tab</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator className="my-8" />

      {/* Accordion Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Accordion</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern and is fully accessible.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Does it work with RTL?</AccordionTrigger>
            <AccordionContent>
              Yes. All components are tested with both LTR and RTL layouts.
              The chevron icon and spacing automatically adapt to the text direction.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can it be customized?</AccordionTrigger>
            <AccordionContent>
              Yes. All components accept className props and can be styled with Tailwind classes.
              You can also modify the component source code to fit your needs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Separator className="my-8" />

      {/* RTL Test Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">RTL Test</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RTL Support Test</CardTitle>
              <CardDescription>
                Switch to Arabic (/ar/components-test) to see RTL layout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-12 bg-brand-primary rounded-lg flex items-center ps-4 text-white">
                    Start padding (ps-4)
                  </div>
                  <div className="flex-1 h-12 bg-brand-secondary rounded-lg flex items-center pe-4 justify-end text-white">
                    End padding (pe-4)
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button className="ms-0">Margin start (ms-0)</Button>
                  <Button className="me-auto">Margin end (me-auto)</Button>
                </div>
                <p className="text-sm text-neutral-600">
                  All spacing and positioning automatically flips in RTL mode.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="mt-12 p-6 bg-neutral-light rounded-xl">
        <h3 className="font-semibold mb-2">✅ Component Integration Complete</h3>
        <p className="text-sm text-neutral-600">
          All shadcn/ui components are installed and styled with FiftyFifty brand colors.
          They are fully accessible and support RTL layout for Arabic.
        </p>
      </div>
    </div>
  )
}

