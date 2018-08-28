export interface BasicInterface {
    // #[id]
    id: number;

    // this is a random string
    randomString: string;

    // #[date.future]
    futureDate: Date;

    // #[date.past]
    pastDate: Date;

    randomDate: Date;

    numberArray: number[];

    fixedLengthArray: [number, number, number];
}
