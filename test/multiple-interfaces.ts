export interface RootLayer {
    // #[id]
    id: number;

    name: string;

    firstLayer: FirstLayer;

    arrayLayer: ArrayLayer[];
}

export interface FirstLayer {
    // #[id]
    id: number;

    name: string;

    secondLayer: SecondLayer;
}

export interface SecondLayer {
    // #[id]
    id: number;

    name: string;
}

export interface ArrayLayer {
    // #[id]
    id: number;
}
