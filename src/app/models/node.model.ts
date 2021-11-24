export interface NodeModel {
    type: 'folder' | 'file' | 'unset' | null;
    name?: string;
    children?: NodeModel[];
    id: number;
}