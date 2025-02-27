import * as React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

// Local implementation of cn function to avoid dependency issues
// This replaces the import from @/lib/utils
import { ClassValue, clsx } from "clsx"
function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

type ViewProps = React.ComponentPropsWithoutRef<typeof View>
type ViewRef = React.ElementRef<typeof View>

const Card = React.forwardRef<ViewRef, ViewProps>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.card, style]}
      {...props}
    />
  )
) as ForwardRefExoticComponent<ViewProps & RefAttributes<ViewRef>> & { displayName: string }
Card.displayName = "Card"

const CardHeader = React.forwardRef<ViewRef, ViewProps>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.cardHeader, style]}
      {...props}
    />
  )
) as ForwardRefExoticComponent<ViewProps & RefAttributes<ViewRef>> & { displayName: string }
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<ViewRef, ViewProps>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.cardTitle, style]}
      {...props}
    />
  )
) as ForwardRefExoticComponent<ViewProps & RefAttributes<ViewRef>> & { displayName: string }
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<ViewRef, ViewProps>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.cardDescription, style]}
      {...props}
    />
  )
) as ForwardRefExoticComponent<ViewProps & RefAttributes<ViewRef>> & { displayName: string }
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<ViewRef, ViewProps>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.cardContent, style]} {...props} />
  )
) as ForwardRefExoticComponent<ViewProps & RefAttributes<ViewRef>> & { displayName: string }
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<ViewRef, ViewProps>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.cardFooter, style]}
      {...props}
    />
  )
) as ForwardRefExoticComponent<ViewProps & RefAttributes<ViewRef>> & { displayName: string }
CardFooter.displayName = "CardFooter"

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    margin: 4,
  },
  cardHeader: {
    padding: 16,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardDescription: {
    marginTop: 4,
  },
  cardContent: {
    padding: 16,
    paddingTop: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 0,
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }