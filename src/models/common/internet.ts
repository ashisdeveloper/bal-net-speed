export interface IInternetSpeedFast {
    downloadSpeed: number;
    uploadSpeed: number;
    downloadUnit: string;
    uploadUnit: string;
    userLocation: string;
    userIp: string;
    isSuccess: boolean;
}

export interface IInternetSpeedHr {
    intNetDownload?: number;
    intNetUpload?: number;
    intNetHr?: number;
}

export interface IInternetSpeedHrApiResponse {
    successful: boolean;
    message: string;
    data?: Array<IInternetSpeedHr>;
}

export interface IInternetSpeedDay {
    intNetDownload?: number;
    intNetUpload?: number;
    dtmNetDay?: string;
}

export interface IInternetSpeedDaysApiResponse {
    successful: boolean;
    message: string;
    data?: Array<IInternetSpeedDay>;
}

export interface IInternetSpeedUpdateApiRequest {
    intNetLocUid?: number;
    intNetDownload?: number;
    intNetUpload?: number;
    vchNetLog?: string;
}

export interface IInternetSpeedUpdateApiResponse {
    successful: boolean;
}