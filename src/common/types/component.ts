export type Props = {
  [key: string]: any;
};

export type IComponentProps<TProps extends Props> = {
  [P in keyof TProps]: TProps[P];
};

type Values<T> = T[keyof T];
type JsonPointer<T = never> = T extends (infer C)[]
  ? `/${number}` | `/${number}${JsonPointer<C>}`
  : T extends object
  ? Values<{
      [K in keyof T]:
        | `/${K extends symbol ? never : K}`
        | `/${K extends symbol ? never : K}${JsonPointer<T[K]>}`;
    }>
  : never;

export type IComponentBindings<TProps extends Props, TData> = {
  [P in keyof TProps]: JsonPointer<TData>;
};

export interface IComponent<TProps extends Props, TData> {
  name: string;
  description: string;

  props: IComponentProps<TProps>;
  bindings: IComponentBindings<TProps, TData>;
}

interface TextProps {
  value: string;
}

export class TextComponentDto<TData> implements IComponent<TextProps, TData> {
  name: string;
  description: string;

  props: IComponentProps<TextProps>;
  bindings: IComponentBindings<TextProps, TData>;
}

// const data = { text: 'Binded text' };
// const textComponent = new TextComponentDto<typeof data>();
// textComponent.props = { value: 'test' };
// textComponent.bindings = { value: '/text123' };
//
// console.log(textComponent);
