export interface NestedInterface {
    // #[uuid]
    uuid: string;

    user: {
        // #[uuid]
        uuid: string;
        // #[firstname]
        firstName: string;
        // #[lastname]
        lastName: string;
    };
}
