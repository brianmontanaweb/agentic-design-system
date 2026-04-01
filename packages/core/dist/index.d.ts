import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import * as _chakra_ui_react from '@chakra-ui/react';
export { Badge, Box, Card, Code, Flex, Grid, HStack, Heading, Separator, Stack, Text, VStack } from '@chakra-ui/react';

interface AgenticProviderProps {
    children: React.ReactNode;
}
declare function AgenticProvider({ children }: AgenticProviderProps): react_jsx_runtime.JSX.Element;

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
interface ButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    leftIcon?: React.ReactElement;
    rightIcon?: React.ReactElement;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (event: React.MouseEvent) => void;
    children?: React.ReactNode;
    'aria-label'?: string;
}
declare function Button({ variant, size, disabled, loading, loadingText, leftIcon, rightIcon, fullWidth, type, onClick, children, 'aria-label': ariaLabel, }: ButtonProps): react_jsx_runtime.JSX.Element;

interface CodeBlockProps {
    children: React.ReactNode;
    language?: string;
}
declare function CodeBlock({ children, language }: CodeBlockProps): react_jsx_runtime.JSX.Element;

declare const system: _chakra_ui_react.SystemContext;

export { AgenticProvider, type AgenticProviderProps, Button, type ButtonProps, type ButtonSize, type ButtonVariant, CodeBlock, type CodeBlockProps, system };
