<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

useSeoMeta({
  title: 'Forms Layer Demo',
  description: 'Config-driven form fields with Zod validation and type inference',
})

const { setPageAccent } = useThemePreferences()
setPageAccent('cyan')
onUnmounted(() => setPageAccent(null))

// Field types for demo
const fieldTypes = [
  { type: 'text', description: 'Basic text input' },
  { type: 'name', description: 'Name with user icon' },
  { type: 'email', description: 'Email with validation' },
  { type: 'phone', description: 'Phone number input' },
  { type: 'password', description: 'Password with lock icon' },
  { type: 'url', description: 'URL with link icon' },
  { type: 'textarea', description: 'Multi-line text' },
  { type: 'number', description: 'Numeric input' },
  { type: 'date', description: 'Date picker' },
  { type: 'time', description: 'Time picker' },
  { type: 'search', description: 'Search with icon' },
  { type: 'currency', description: 'Currency formatting' },
] as const

// Demo form states
const fieldDemoValues = reactive<Record<string, string | number>>({
  text: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  url: '',
  textarea: '',
  number: 0,
  date: '',
  time: '',
  search: '',
  currency: 0,
})

// Validation demo
const validationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type ValidationState = z.infer<typeof validationSchema>

const validationState = reactive<Partial<ValidationState>>({
  email: '',
  password: '',
})

const validationSubmitted = ref(false)

async function onValidationSubmit(_event: FormSubmitEvent<ValidationState>) {
  validationSubmitted.value = true
  setTimeout(() => {
    validationSubmitted.value = false
  }, 3000)
}

// Contact form demo state
const contactSubmitted = ref(false)

function onContactSubmit() {
  contactSubmitted.value = true
  setTimeout(() => {
    contactSubmitted.value = false
  }, 3000)
}

// Code samples
const fieldConfigCode = `// config/fields.ts
export const fieldConfigs = {
  email: {
    icon: 'i-lucide-mail',
    inputType: 'email',
    inputMode: 'email',
    autocomplete: 'email',
    placeholder: 'you@example.com',
    validation: z.string().email('Please enter a valid email'),
  },
  password: {
    icon: 'i-lucide-lock',
    inputType: 'password',
    autocomplete: 'current-password',
    validation: z.string().min(8, 'Password must be at least 8 characters'),
  },
  // ... more field types
}`

const formFieldUsageCode = `<FormField
  v-model="state.email"
  type="email"
  name="email"
  label="Email"
  required
/>`

const zodSchemaCode = `import { z } from 'zod'
import { fieldConfigs } from '~/config/fields'

const schema = z.object({
  name: fieldConfigs.name.validation.pipe(
    z.string().min(3, 'Name must be at least 3 characters')
  ),
  email: fieldConfigs.email.validation,
  message: fieldConfigs.textarea.validation.pipe(
    z.string().min(8, 'Message must be at least 8 characters')
  ),
})

// Type is automatically inferred
type FormState = z.infer<typeof schema>`
</script>

<template>
  <div class="min-h-screen bg-default text-default p-8">
    <UContainer>
      <div class="space-y-12">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" />
          <div>
            <h1 class="text-3xl font-bold text-highlighted">Forms Layer</h1>
            <p class="text-muted">
              Config-driven form fields with Zod validation
            </p>
          </div>
        </div>

        <!-- Overview -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-info" class="text-primary" />
              <h2 class="text-xl font-semibold">Overview</h2>
            </div>
          </template>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <p>
              The Forms layer provides a config-driven approach to form fields. Instead of manually
              configuring each input, you define field types once and reuse them throughout your
              application.
            </p>
            <div class="grid gap-4 md:grid-cols-3 not-prose mt-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <UIcon name="i-lucide-settings" class="text-primary" />
                  <h3 class="font-semibold">Config-Driven</h3>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Define field behavior once in a central config
                </p>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <UIcon name="i-lucide-shield-check" class="text-primary" />
                  <h3 class="font-semibold">Zod Validation</h3>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Type-safe validation with automatic TypeScript inference
                </p>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <UIcon name="i-lucide-component" class="text-primary" />
                  <h3 class="font-semibold">Single Component</h3>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  One FormField component handles all input types
                </p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Field Types -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">Field Types</h2>
            <p class="text-gray-500">
              12 built-in field types with automatic icons, validation, and input modes
            </p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-text-cursor-input" class="text-primary" />
                <h3 class="text-xl font-semibold">FormField Component</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">Dynamic field rendering based on type prop</p>
            </template>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div v-for="field in fieldTypes" :key="field.type" class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-500">{{ field.type }}</span>
                  <UBadge variant="subtle" size="xs">{{ field.description }}</UBadge>
                </div>
                <FormField
                  v-model="fieldDemoValues[field.type]"
                  :type="field.type"
                  :name="field.type"
                  size="md"
                />
              </div>
            </div>

            <template #footer>
              <div
                class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto"
              >
                <pre>{{ formFieldUsageCode }}</pre>
              </div>
            </template>
          </UCard>
        </section>

        <!-- Field Configuration -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">Field Configuration</h2>
            <p class="text-gray-500">
              Each field type is defined in a central configuration with validation, icons, and
              input behavior
            </p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-file-code" class="text-primary" />
                <h3 class="text-xl font-semibold">fieldConfigs</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">Central registry for field type definitions</p>
            </template>

            <div class="space-y-6">
              <!-- Config Properties -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Configuration Properties
                </h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b">
                        <th class="text-left py-2 px-3">Property</th>
                        <th class="text-left py-2 px-3">Type</th>
                        <th class="text-left py-2 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y">
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">icon</td>
                        <td class="py-2 px-3 font-mono text-xs">string</td>
                        <td class="py-2 px-3">Lucide icon class (e.g., 'i-lucide-mail')</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">inputType</td>
                        <td class="py-2 px-3 font-mono text-xs">string</td>
                        <td class="py-2 px-3">HTML input type attribute</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">inputMode</td>
                        <td class="py-2 px-3 font-mono text-xs">InputMode</td>
                        <td class="py-2 px-3">Mobile keyboard optimization</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">autocomplete</td>
                        <td class="py-2 px-3 font-mono text-xs">string</td>
                        <td class="py-2 px-3">Browser autocomplete hint</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">placeholder</td>
                        <td class="py-2 px-3 font-mono text-xs">string</td>
                        <td class="py-2 px-3">Default placeholder text</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">validation</td>
                        <td class="py-2 px-3 font-mono text-xs">ZodSchema</td>
                        <td class="py-2 px-3">Zod validation schema</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono text-xs">component</td>
                        <td class="py-2 px-3 font-mono text-xs">FieldComponent</td>
                        <td class="py-2 px-3">Nuxt UI component to render</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Code Example -->
              <div>
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500 mb-3">
                  Example Configuration
                </h4>
                <div
                  class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto"
                >
                  <pre>{{ fieldConfigCode }}</pre>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- Validation Demo -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">Zod Validation</h2>
            <p class="text-gray-500">
              Built-in validation with Zod schemas and automatic error messages
            </p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-shield-check" class="text-primary" />
                <h3 class="text-xl font-semibold">Validation Demo</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Try submitting with invalid data to see validation errors
              </p>
            </template>

            <div class="grid gap-8 lg:grid-cols-2">
              <!-- Form -->
              <div>
                <UForm
                  :schema="validationSchema"
                  :state="validationState"
                  class="space-y-4"
                  @submit="onValidationSubmit"
                >
                  <FormField
                    v-model="validationState.email"
                    type="email"
                    name="email"
                    label="Email"
                    required
                  />
                  <FormField
                    v-model="validationState.password"
                    type="password"
                    name="password"
                    label="Password"
                    required
                  />
                  <div class="flex items-center gap-4">
                    <UButton type="submit"> Validate & Submit </UButton>
                    <Transition
                      enter-active-class="transition-opacity duration-300"
                      leave-active-class="transition-opacity duration-300"
                      enter-from-class="opacity-0"
                      leave-to-class="opacity-0"
                    >
                      <UBadge v-if="validationSubmitted" color="success" size="lg">
                        <UIcon name="i-lucide-check" class="mr-1" />
                        Valid!
                      </UBadge>
                    </Transition>
                  </div>
                </UForm>
              </div>

              <!-- Validation Rules -->
              <div class="space-y-4">
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Validation Rules
                </h4>
                <div class="space-y-3">
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <UIcon name="i-lucide-mail" class="text-primary" />
                      <span class="font-medium">Email</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Must be a valid email address format
                    </p>
                  </div>
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <UIcon name="i-lucide-lock" class="text-primary" />
                      <span class="font-medium">Password</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Minimum 8 characters required
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- Type Inference -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">Type Inference</h2>
            <p class="text-gray-500">Automatic TypeScript types from Zod schemas</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-file-type" class="text-primary" />
                <h3 class="text-xl font-semibold">z.infer&lt;typeof schema&gt;</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Get compile-time type safety from your validation schemas
              </p>
            </template>

            <div class="space-y-6">
              <div
                class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto"
              >
                <pre>{{ zodSchemaCode }}</pre>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div
                  class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-lucide-check-circle" class="text-green-600" />
                    <h4 class="font-semibold text-green-800 dark:text-green-200">Benefits</h4>
                  </div>
                  <ul class="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Autocomplete for form state properties</li>
                    <li>• Compile-time error detection</li>
                    <li>• Refactoring safety</li>
                    <li>• Single source of truth</li>
                  </ul>
                </div>
                <div
                  class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-lucide-lightbulb" class="text-blue-600" />
                    <h4 class="font-semibold text-blue-800 dark:text-blue-200">Usage Tips</h4>
                  </div>
                  <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>
                      • Use
                      <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">.pipe()</code> to
                      extend base validation
                    </li>
                    <li>
                      • Compose schemas with
                      <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">z.object()</code>
                    </li>
                    <li>• Add custom refinements as needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- Complete Example -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">Complete Example</h2>
            <p class="text-gray-500">A fully functional contact form using the Forms layer</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-mail" class="text-primary" />
                <h3 class="text-xl font-semibold">Contact Form</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                Pre-built form component with name, email, and message fields
              </p>
            </template>

            <div class="grid gap-8 lg:grid-cols-2">
              <!-- Live Form -->
              <div>
                <FormContact @submit="onContactSubmit" />
                <Transition
                  enter-active-class="transition-all duration-300"
                  leave-active-class="transition-all duration-300"
                  enter-from-class="opacity-0 translate-y-2"
                  leave-to-class="opacity-0 translate-y-2"
                >
                  <div
                    v-if="contactSubmitted"
                    class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-check-circle" class="text-green-600" />
                      <span class="font-medium text-green-800 dark:text-green-200">
                        Form submitted successfully!
                      </span>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Component Info -->
              <div class="space-y-4">
                <h4 class="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Component Features
                </h4>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <UIcon name="i-lucide-check" class="text-green-500 mt-0.5" />
                    <div>
                      <span class="font-medium">3 field types</span>
                      <p class="text-sm text-gray-500">name, email, textarea</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <UIcon name="i-lucide-check" class="text-green-500 mt-0.5" />
                    <div>
                      <span class="font-medium">Zod validation</span>
                      <p class="text-sm text-gray-500">
                        Name ≥3 chars, valid email, message ≥8 chars
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <UIcon name="i-lucide-check" class="text-green-500 mt-0.5" />
                    <div>
                      <span class="font-medium">Toast notifications</span>
                      <p class="text-sm text-gray-500">Success/error feedback on submit</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <UIcon name="i-lucide-check" class="text-green-500 mt-0.5" />
                    <div>
                      <span class="font-medium">Type-safe state</span>
                      <p class="text-sm text-gray-500">Full TypeScript inference</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </section>

        <!-- FormField Props -->
        <section class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">API Reference</h2>
            <p class="text-gray-500">FormField component props</p>
          </div>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-code" class="text-primary" />
                <h3 class="text-xl font-semibold">FormField Props</h3>
              </div>
            </template>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2 px-3">Prop</th>
                    <th class="text-left py-2 px-3">Type</th>
                    <th class="text-left py-2 px-3">Default</th>
                    <th class="text-left py-2 px-3">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr>
                    <td class="py-2 px-3 font-mono text-xs">type</td>
                    <td class="py-2 px-3 font-mono text-xs">FieldType</td>
                    <td class="py-2 px-3 font-mono text-xs">'text'</td>
                    <td class="py-2 px-3">Field type (email, password, etc.)</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-mono text-xs">name</td>
                    <td class="py-2 px-3 font-mono text-xs">string</td>
                    <td class="py-2 px-3 font-mono text-xs">required</td>
                    <td class="py-2 px-3">Field name for form binding</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-mono text-xs">label</td>
                    <td class="py-2 px-3 font-mono text-xs">string</td>
                    <td class="py-2 px-3 font-mono text-xs">-</td>
                    <td class="py-2 px-3">Label text above field</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-mono text-xs">required</td>
                    <td class="py-2 px-3 font-mono text-xs">boolean</td>
                    <td class="py-2 px-3 font-mono text-xs">false</td>
                    <td class="py-2 px-3">Show required indicator</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-mono text-xs">size</td>
                    <td class="py-2 px-3 font-mono text-xs">FieldSize</td>
                    <td class="py-2 px-3 font-mono text-xs">'md'</td>
                    <td class="py-2 px-3">Field size (xs, sm, md, lg, xl)</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-mono text-xs">placeholder</td>
                    <td class="py-2 px-3 font-mono text-xs">string</td>
                    <td class="py-2 px-3 font-mono text-xs">from config</td>
                    <td class="py-2 px-3">Override default placeholder</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-mono text-xs">icon</td>
                    <td class="py-2 px-3 font-mono text-xs">string</td>
                    <td class="py-2 px-3 font-mono text-xs">from config</td>
                    <td class="py-2 px-3">Override default icon</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-mono text-xs">v-model</td>
                    <td class="py-2 px-3 font-mono text-xs">string | number</td>
                    <td class="py-2 px-3 font-mono text-xs">-</td>
                    <td class="py-2 px-3">Two-way binding for field value</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </UCard>
        </section>

        <!-- Navigation -->
        <div class="flex gap-4 justify-center pt-4">
          <UButton to="/ui" variant="outline" icon="i-lucide-arrow-left"> UI Layer Demo </UButton>
          <UButton to="/" icon="i-lucide-home"> Back to Home </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
