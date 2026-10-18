export type HierarchyKind = "epic" | "feature";
export type HierarchyDraft = {
  title: string;
  description: string;
  acceptanceCriteria: string;
  parentId: string;
  statusId: string;
};
export type HierarchyTarget = HierarchyDraft & {
  kind: HierarchyKind;
  id?: string;
};
