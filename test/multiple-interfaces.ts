export interface RootLayer {
    // #[id]
    id: number;

    name: string;

    firstLayer: FirstLayer;
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
