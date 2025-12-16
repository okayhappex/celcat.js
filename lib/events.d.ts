export interface RawCourse {
    uid: string;
    summary: string;
    start: Date;
    end: Date;
    location: string;
    description: string;
}
export interface Course {
    uid: string;
    type: string;
    summary: string;
    start: Date;
    end: Date;
    teachers: string[];
    location: string;
    module: string;
}
