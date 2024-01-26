import {
  AddressField,
  AddressSchema,
  BooleanCheckboxField,
  BooleanField,
  BooleanSwitchField,
  Button,
  FieldError,
  Form,
  FormProps,
  FormWrapper,
  NumberField,
  Paragraph,
  SelectField,
  Text,
  TextAreaField,
  TextField,
  Theme,
  ToggleGroup,
  Tooltip,
  TooltipProps,
  XStack,
} from '@my/ui'
import { Star } from '@tamagui/lucide-icons'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { DateField } from 'app/features/auth/components/DateField.native'
import React, { ComponentProps } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const formFields = {
  text: z.string(),
  textarea: createUniqueFieldSchema(z.string(), 'textarea'),
  /**
   * input that takes number
   */
  number: z.number(),
  /**
   * adapts to native switch on native, and native checkbox on web
   */
  boolean: z.boolean(),
  /**
   * switch field on all platforms
   */
  boolean_switch: createUniqueFieldSchema(z.boolean(), 'boolean_switch'),
  /**
   * checkbox field on all platforms
   */
  boolean_checkbox: createUniqueFieldSchema(z.boolean(), 'boolean_checkbox'),
  /**
   * make sure to pass options={} to props for this
   */
  select: createUniqueFieldSchema(z.string(), 'select'),
  /**
   * example of how to handle more complex fields
   */
  address: createUniqueFieldSchema(AddressSchema, 'address'),
  /**
   * rating field on all platforms
   */
  rating: createUniqueFieldSchema(z.string(), 'rating'),
  /**
   * date field on all platforms
   */
  date: z.date(),
}

// function createFormSchema<T extends ZodRawShape>(getData: (fields: typeof formFields) => T) {
//   return z.object(getData(formFields))
// }

type RatingFieldType = {
  title: string
  info?: string
  rating?: string
  count: number
}

const RatingField = (props: ComponentProps<typeof ToggleGroup> & RatingFieldType) => {
  return (
    <XStack jc="space-between" ai="center" pb="$3">
      <XStack jc="flex-start" ai="center" gap="$2.5">
        <Text fontSize="$2" color="#717171" fontWeight="600">
          {props.title}
        </Text>
        {props.info && (
          <Button
            opacity={0.3}
            borderColor="#121212"
            size={15}
            p="$0"
            icon={
              <Text textAlign="center" color="#121212" fontSize={12} fontWeight="600">
                ?
              </Text>
            }
            circular
          />
        )}
      </XStack>
      <ToggleGroup unstyled {...props}>
        {Array.from(Array(props.count).keys()).map((i) => {
          return (
            <ToggleGroup.Item pressStyle={{ opacity: 0.3 }} unstyled w="$1.5" value={String(i + 1)}>
              <Star
                fill={Number(props.rating) >= i + 1 ? '#FFD646' : '#BCBCBC'}
                strokeWidth={0}
                size={20}
              />
            </ToggleGroup.Item>
          )
        })}
      </ToggleGroup>
    </XStack>
  )
}

const mapping = [
  [formFields.text, TextField] as const,
  [formFields.textarea, TextAreaField] as const,
  [formFields.number, NumberField] as const,
  [formFields.boolean, BooleanField] as const,
  [formFields.boolean_switch, BooleanSwitchField] as const,
  [formFields.boolean_checkbox, BooleanCheckboxField] as const,
  [formFields.select, SelectField] as const,
  [formFields.address, AddressField] as const,
  [formFields.rating, RatingField] as const,
  [formFields.date, DateField] as const,
] as const

const FormComponent = (props: FormProps) => {
  return (
    <Form asChild {...props}>
      <FormWrapper tag="form">{props.children}</FormWrapper>
    </Form>
  )
}

const _SchemaForm = createTsForm(mapping, {
  FormComponent,
})

export const SchemaForm: typeof _SchemaForm = ({ ...props }) => {
  const renderAfter: ComponentProps<typeof _SchemaForm>['renderAfter'] = props.renderAfter
    ? (vars) => <FormWrapper.Footer>{props.renderAfter?.(vars)}</FormWrapper.Footer>
    : undefined

  return (
    <_SchemaForm {...props} renderAfter={renderAfter}>
      {(fields, context) => (
        <FormWrapper.Body>
          {props.children ? props.children(fields, context) : Object.values(fields)}
        </FormWrapper.Body>
      )}
    </_SchemaForm>
  )
}

// handle manual errors (most commonly coming from a server) for cases where it's not for a specific field - make sure to wrap inside a provider first
// stopped using it cause of state issues it introduced - set the errors to specific fields instead of root for now
export const RootError = () => {
  const context = useFormContext()
  const errorMessage = context?.formState?.errors?.root?.message

  return (
    <Theme name="red">
      <FieldError message={errorMessage} />
    </Theme>
  )
}
