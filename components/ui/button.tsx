import * as React from "react"
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

// Local implementation of cn function to avoid dependency issues
// This replaces the import from @/lib/utils
import { ClassValue, clsx } from "clsx"
function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const buttonVariants = cva(
  "flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary",
        destructive: "bg-destructive",
        outline: "border border-input bg-background",
        secondary: "bg-secondary",
        ghost: "hover:bg-accent",
        link: "text-primary underline-offset-4",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps extends React.ComponentProps<typeof Pressable>,
  VariantProps<typeof buttonVariants> {
  title: string
  textStyle?: StyleProp<TextStyle>
  style?: StyleProp<ViewStyle>
}

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, variant, size, title, textStyle, style, ...props }, ref) => {
  const getButtonStyle = () => {
    switch(variant) {
      case 'default':
        return styles.default
      case 'destructive':
        return styles.destructive
      case 'outline':
        return styles.outline
      case 'secondary':
        return styles.secondary
      case 'ghost':
        return styles.ghost
      case 'link':
        return styles.link
      default:
        return styles.default
    }
  }
  
  const getTextStyle = () => {
    switch(variant) {
      case 'default':
      case 'destructive':
        return styles.defaultText
      case 'outline':
      case 'secondary':
      case 'ghost':
        return styles.alternateText
      case 'link':
        return styles.linkText
      default:
        return styles.defaultText
    }
  }
  
  const getSizeStyle = () => {
    switch(size) {
      case 'sm':
        return styles.sm
      case 'lg':
        return styles.lg
      case 'icon':
        return styles.icon
      default:
        return styles.defaultSize
    }
  }

  return (
    <Pressable
      ref={ref}
      style={[
        getButtonStyle(),
        getSizeStyle(),
        style,
      ]}
      {...props}
    >
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </Pressable>
  )
}) as ForwardRefExoticComponent<ButtonProps & RefAttributes<React.ElementRef<typeof Pressable>>> & { displayName: string }

Button.displayName = "Button"

const styles = StyleSheet.create({
  default: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    elevation: 2,
  },
  destructive: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  secondary: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  ghost: {
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  link: {
    backgroundColor: "transparent",
  },
  defaultSize: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 40,
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    height: 44,
  },
  icon: {
    width: 40,
    height: 40,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  alternateText: {
    color: "#0f172a",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: 16,
    textDecorationLine: "underline",
  }
})

export { Button, buttonVariants }