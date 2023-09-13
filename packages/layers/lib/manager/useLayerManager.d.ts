import { LayerState } from '../interfaces';
export declare function useLayerManager<C>(
  collector?: (state: LayerState) => C
): {
  store: import('@craftjs/utils').SubscriberAndCallbacksFor<
    (
      state: LayerState
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
  C,
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
              domCollection: Partial<Record<'dom' | 'headingDom', HTMLElement>>
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
              domCollection: Partial<Record<'dom' | 'headingDom', HTMLElement>>
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
              domCollection: Partial<Record<'dom' | 'headingDom', HTMLElement>>
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
>;
