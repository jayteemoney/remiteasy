import { useState } from 'react'
import { AnimatedPage } from '../components/AnimatedPage'
import {
  Button,
  Card,
  Badge,
  Input,
  Select,
  Modal,
  Tooltip,
  Progress,
  Tabs,
  EmptyState,
  Avatar,
  Divider,
  Spinner,
  SkeletonCard,
  SkeletonList,
} from '../components/ui'
import {
  Home,
  Send,
  Settings,
  User,
  Mail,
  Bell,
  Search,
  Heart,
} from 'lucide-react'

export function ComponentShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [progressValue, setProgressValue] = useState(65)

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            UI Components Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A comprehensive collection of modern, accessible UI components
          </p>
        </div>

        <Divider />

        {/* Buttons */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Buttons
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button isLoading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width</Button>
            </div>
          </div>
        </Card>

        {/* Badges */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="purple">Purple</Badge>
          </div>
          <Divider className="my-6" />
          <div className="flex flex-wrap gap-4">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </Card>

        {/* Inputs & Forms */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Inputs & Forms
          </h2>
          <div className="space-y-4 max-w-md">
            <Input label="Email" type="email" placeholder="Enter your email" />
            <Input
              label="Search"
              placeholder="Search..."
              leftIcon={<Search className="w-5 h-5" />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              helperText="Must be at least 8 characters"
            />
            <Input
              label="Error Example"
              placeholder="Invalid input"
              error="This field is required"
            />
            <Select
              label="Country"
              options={[
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'ca', label: 'Canada' },
              ]}
            />
          </div>
        </Card>

        {/* Progress */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Progress Bars
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Progress: {progressValue}%
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
                  >
                    -10
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
                  >
                    +10
                  </Button>
                </div>
              </div>
              <Progress value={progressValue} showLabel />
            </div>
            <Progress value={75} variant="success" />
            <Progress value={50} variant="warning" />
            <Progress value={25} variant="danger" />
          </div>
        </Card>

        {/* Avatars */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Avatars
          </h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar size="sm" />
              <Avatar size="md" />
              <Avatar size="lg" />
              <Avatar size="xl" />
            </div>
            <div className="flex items-center gap-4">
              <Avatar size="md" status="online" />
              <Avatar size="md" status="busy" />
              <Avatar size="md" status="away" />
              <Avatar size="md" status="offline" />
            </div>
          </div>
        </Card>

        {/* Tooltips */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tooltips
          </h2>
          <div className="flex flex-wrap gap-6">
            <Tooltip content="Top tooltip" position="top">
              <Button variant="outline">Hover (Top)</Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" position="bottom">
              <Button variant="outline">Hover (Bottom)</Button>
            </Tooltip>
            <Tooltip content="Left tooltip" position="left">
              <Button variant="outline">Hover (Left)</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" position="right">
              <Button variant="outline">Hover (Right)</Button>
            </Tooltip>
          </div>
        </Card>

        {/* Modal */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Modal
          </h2>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
          >
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                This is a beautiful, accessible modal component with animations
                and keyboard support.
              </p>
              <Input label="Name" placeholder="Enter your name" />
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
              </div>
            </div>
          </Modal>
        </Card>

        {/* Tabs */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tabs
          </h2>
          <Tabs
            tabs={[
              {
                id: 'home',
                label: 'Home',
                icon: <Home />,
                content: (
                  <p className="text-gray-600 dark:text-gray-400">
                    Home tab content goes here
                  </p>
                ),
              },
              {
                id: 'profile',
                label: 'Profile',
                icon: <User />,
                content: (
                  <p className="text-gray-600 dark:text-gray-400">
                    Profile tab content goes here
                  </p>
                ),
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: <Settings />,
                content: (
                  <p className="text-gray-600 dark:text-gray-400">
                    Settings tab content goes here
                  </p>
                ),
              },
            ]}
          />
          <Divider label="Pills Variant" className="my-8" />
          <Tabs
            variant="pills"
            tabs={[
              {
                id: 'messages',
                label: 'Messages',
                icon: <Mail />,
                content: (
                  <p className="text-gray-600 dark:text-gray-400">
                    Messages tab content
                  </p>
                ),
              },
              {
                id: 'notifications',
                label: 'Notifications',
                icon: <Bell />,
                content: (
                  <p className="text-gray-600 dark:text-gray-400">
                    Notifications tab content
                  </p>
                ),
              },
            ]}
          />
        </Card>

        {/* Empty State */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Empty States
          </h2>
          <EmptyState
            icon={<Heart />}
            title="No items yet"
            description="Get started by adding your first item"
            action={{
              label: 'Add Item',
              onClick: () => alert('Add item clicked!'),
            }}
          />
        </Card>

        {/* Skeletons */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Loading Skeletons
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Card Skeleton
              </h3>
              <SkeletonCard />
            </div>
            <Divider />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                List Skeleton
              </h3>
              <SkeletonList count={3} />
            </div>
          </div>
        </Card>

        {/* Spinners */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Spinners
          </h2>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <Spinner size="sm" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Small</p>
            </div>
            <div className="text-center">
              <Spinner size="md" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Medium
              </p>
            </div>
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Large</p>
            </div>
            <div className="text-center">
              <Spinner size="xl" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Extra Large
              </p>
            </div>
          </div>
        </Card>

        {/* Interactive Cards */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Card Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover>
              <div className="text-center">
                <Send className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Hover Card
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hover for effect
                </p>
              </div>
            </Card>
            <Card glass>
              <div className="text-center">
                <User className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Glass Card
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Frosted glass effect
                </p>
              </div>
            </Card>
            <Card gradient>
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-600 dark:text-gray-300" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Gradient Card
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Subtle gradient
                </p>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </AnimatedPage>
  )
}
