/// <reference types="react" />
import { Layer } from '../interfaces';
export declare function useLayer<S = null>(
  collect?: (layer: Layer) => S
): {
  id: any;
  depth: number;
  children: any;
  actions: {
    toggleLayer: () => void;
  };
  connectors: import('@craftjs/utils').ChainableConnectors<
    {
      layer: (el: HTMLElement) => HTMLElement;
      drag: (el: HTMLElement) => HTMLElement;
      layerHeader: (el: HTMLElement) => HTMLElement;
    },
    | HTMLElement
    | import('react').ReactElement<
        any,
        | string
        | ((props: any) => import('react').ReactElement<any, any>)
        | (new (props: any) => import('react').Component<any, any, any>)
      >
  >;
} & Pick<
  {
    store: import('@craftjs/utils').SubscriberAndCallbacksFor<
      (
        state: import('../interfaces').LayerState
      ) => {
        setLayerEvent: (
          eventType: import('../interfaces').LayerEvents,
          id: string
        ) => void;
        registerLayer: (id: string) => void;
        setDOM: (
          id: string,
          domCollection: Partial<Record<'dom' | 'headingDom', HTMLElement>>
        ) => void;
        toggleLayer: (id: string) => void;
        setIndicator: (indicator: any) => void;
      },
      any
    >;
  } & import('@craftjs/utils').ConditionallyMergeRecordTypes<
    S,
    {
      actions: {
        setLayerEvent: (
          eventType: import('../interfaces').LayerEvents,
          id: string
        ) => void;
        registerLayer: (id: string) => void;
        setDOM: (
          id: string,
          domCollection: Partial<Record<'dom' | 'headingDom', HTMLElement>>
        ) => void;
        toggleLayer: (id: string) => void;
        setIndicator: (indicator: any) => void;
      } & {
        history: {
          undo: () => void;
          redo: () => void;
          clear: () => void;
          throttle: (
            rate?: number
          ) => Pick<
            {
              setLayerEvent: (
                eventType: import('../interfaces').LayerEvents,
                id: string
              ) => void;
              registerLayer: (id: string) => void;
              setDOM: (
                id: string,
                domCollection: Partial<
                  Record<'dom' | 'headingDom', HTMLElement>
                >
              ) => void;
              toggleLayer: (id: string) => void;
              setIndicator: (indicator: any) => void;
            },
            | 'setLayerEvent'
            | 'registerLayer'
            | 'setDOM'
            | 'toggleLayer'
            | 'setIndicator'
          >;
          merge: () => Pick<
            {
              setLayerEvent: (
                eventType: import('../interfaces').LayerEvents,
                id: string
              ) => void;
              registerLayer: (id: string) => void;
              setDOM: (
                id: string,
                domCollection: Partial<
                  Record<'dom' | 'headingDom', HTMLElement>
                >
              ) => void;
              toggleLayer: (id: string) => void;
              setIndicator: (indicator: any) => void;
            },
            | 'setLayerEvent'
            | 'registerLayer'
            | 'setDOM'
            | 'toggleLayer'
            | 'setIndicator'
          >;
          ignore: () => Pick<
            {
              setLayerEvent: (
                eventType: import('../interfaces').LayerEvents,
                id: string
              ) => void;
              registerLayer: (id: string) => void;
              setDOM: (
                id: string,
                domCollection: Partial<
                  Record<'dom' | 'headingDom', HTMLElement>
                >
              ) => void;
              toggleLayer: (id: string) => void;
              setIndicator: (indicator: any) => void;
            },
            | 'setLayerEvent'
            | 'registerLayer'
            | 'setDOM'
            | 'toggleLayer'
            | 'setIndicator'
          >;
        };
      };
      query:
        | {}
        | ({
            [x: string]: (...payload: any[]) => any;
          } & {
            history: {
              canUndo: () => boolean;
              canRedo: () => boolean;
            };
          });
    }
  >,
  | 'store'
  | Exclude<
      keyof import('@craftjs/utils').ConditionallyMergeRecordTypes<
        S,
        {
          actions: {
            setLayerEvent: (
              eventType: import('../interfaces').LayerEvents,
              id: string
            ) => void;
            registerLayer: (id: string) => void;
            setDOM: (
              id: string,
              domCollection: Partial<Record<'dom' | 'headingDom', HTMLElement>>
            ) => void;
            toggleLayer: (id: string) => void;
            setIndicator: (indicator: any) => void;
          } & {
            history: {
              undo: () => void;
              redo: () => void;
              clear: () => void;
              throttle: (
                rate?: number
              ) => Pick<
                {
                  setLayerEvent: (
                    eventType: import('../interfaces').LayerEvents,
                    id: string
                  ) => void;
                  registerLayer: (id: string) => void;
                  setDOM: (
                    id: string,
                    domCollection: Partial<
                      Record<'dom' | 'headingDom', HTMLElement>
                    >
                  ) => void;
                  toggleLayer: (id: string) => void;
                  setIndicator: (indicator: any) => void;
                },
                | 'setLayerEvent'
                | 'registerLayer'
                | 'setDOM'
                | 'toggleLayer'
                | 'setIndicator'
              >;
              merge: () => Pick<
                {
                  setLayerEvent: (
                    eventType: import('../interfaces').LayerEvents,
                    id: string
                  ) => void;
                  registerLayer: (id: string) => void;
                  setDOM: (
                    id: string,
                    domCollection: Partial<
                      Record<'dom' | 'headingDom', HTMLElement>
                    >
                  ) => void;
                  toggleLayer: (id: string) => void;
                  setIndicator: (indicator: any) => void;
                },
                | 'setLayerEvent'
                | 'registerLayer'
                | 'setDOM'
                | 'toggleLayer'
                | 'setIndicator'
              >;
              ignore: () => Pick<
                {
                  setLayerEvent: (
                    eventType: import('../interfaces').LayerEvents,
                    id: string
                  ) => void;
                  registerLayer: (id: string) => void;
                  setDOM: (
                    id: string,
                    domCollection: Partial<
                      Record<'dom' | 'headingDom', HTMLElement>
                    >
                  ) => void;
                  toggleLayer: (id: string) => void;
                  setIndicator: (indicator: any) => void;
                },
                | 'setLayerEvent'
                | 'registerLayer'
                | 'setDOM'
                | 'toggleLayer'
                | 'setIndicator'
              >;
            };
          };
          query:
            | {}
            | ({
                [x: string]: (...payload: any[]) => any;
              } & {
                history: {
                  canUndo: () => boolean;
                  canRedo: () => boolean;
                };
              });
        }
      >,
      'actions'
    >
>;
