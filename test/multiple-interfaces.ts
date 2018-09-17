export interface RootLayer {
    // #[uuid]
    uuid: string;

    name: string;

    firstLayer: FirstLayer;

    arrayLayer: ArrayLayer[];
}

export interface FirstLayer {
    // #[uuid]
    uuid: string;

    name: string;

    secondLayer: SecondLayer;
}

export interface SecondLayer {
    // #[uuid]
    uuid: string;

    name: string;
}

export interface ArrayLayer {
    // #[uuid]
    uuid: string;
}
