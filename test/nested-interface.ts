export interface NestedInterface {
    // #[id]
    id: number;

    user: {
        // #[firstname]
        firstName: string;
        // #[lastname]
        lastName: string;
    };
}
