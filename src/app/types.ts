export interface DocumentFieldOption {
    visualisation: {
        location: { page: number; x: number; y: number };
        width: number;
        height: number;
        borderWidth: number;
        borderColor: string;
        fontSize: number;
        fontColor: string;
        padding: number;
        borderStyle: string;
        fontStyle: string;
    };
    comboboxExtras: {
        options: { [key: string]: string };
        defaultOptionKey: string;
    };
}

export interface DocumentField {
    fieldType: string;
    options: DocumentFieldOption;
    id: string;
}

export interface DocumentData {
    externalDocId: string;
    mimeType: string;
    title: string;
    fileName: string;
    documentField: DocumentField[];
}
