import { useInternalEditor } from '../editor/useInternalEditor';

export function useEditor<S>(collect?: any) {
  return useInternalEditor(collect);
}
