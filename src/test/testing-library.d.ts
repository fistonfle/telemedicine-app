/**
 * Fallback type declarations when devDependencies are not installed.
 * Run `npm install` in telemedicine-app to use the real packages and types.
 */
declare module "vitest" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function expect<T>(value: T): {
    toBeInTheDocument: () => void;
    toHaveAttribute: (attr: string, value: string) => void;
    toBe: (value: unknown) => void;
    [key: string]: unknown;
  };
  export const vi: {
    fn: (impl?: (...args: unknown[]) => unknown) => (...args: unknown[]) => unknown;
    mock: (path: string, factory?: () => unknown) => void;
    clearAllMocks: () => void;
    mocked: <T>(x: T) => T;
    importActual: <T>(path: string) => Promise<T>;
  };
  export function beforeEach(fn: () => void | Promise<void>): void;
}

declare module "@testing-library/react" {
  import type { ReactElement, ReactNode } from "react";

  export function render(ui: ReactElement, options?: unknown): {
    container: HTMLElement;
    baseElement: HTMLElement;
    unmount: () => void;
    rerender: (ui: ReactElement) => void;
    getByRole: (role: string, options?: unknown) => HTMLElement;
    getByLabelText: (text: string | RegExp, options?: unknown) => HTMLElement;
    getByText: (text: string | RegExp, options?: unknown) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp, options?: unknown) => HTMLElement;
    queryByRole: (role: string, options?: unknown) => HTMLElement | null;
    [key: string]: unknown;
  };

  export const screen: {
    getByRole: (role: string, options?: unknown) => HTMLElement;
    getByLabelText: (text: string | RegExp, options?: unknown) => HTMLElement;
    getByText: (text: string | RegExp, options?: unknown) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp, options?: unknown) => HTMLElement;
    queryByRole: (role: string, options?: unknown) => HTMLElement | null;
    [key: string]: unknown;
  };

  export const fireEvent: {
    click: (element: HTMLElement) => void;
    change: (element: HTMLElement, eventPayload?: unknown) => void;
    submit: (element: HTMLElement) => void;
    [key: string]: (element: HTMLElement, ...args: unknown[]) => void;
  };

  export function waitFor(callback: () => void | Promise<void>, options?: unknown): Promise<void>;
  export function act(callback: () => void | Promise<void>): Promise<void>;
}
