export const backendUrl: string = 'http://127.0.0.1:8000'
// export const backendUrl: string = 'http://3.72.113.129:8000'
export const dataStoreName: string = 'data_store'

export interface CpaStructur {
    [key: string]: CpaValueStructur
}

export interface CpaValueStructur {
    [key: string]: {
        [key: string]: []
    } | string
}

export interface OtherStructur {
    [key: string]: string
}

export const defaultPrePostData: { [key: string]: string } = {
    "Sample ID": "",
    "RunDate": "",
    "Viability (%)": "",
    "Total cells / ml (x 10^6)": "",
    "Total viable cells / ml (x 10^6)": "",
    "Average diameter (microns)": "",
    "Average circularity": "",
    "Cell type": "",
    "Machine version": ""
}

export const defaultCpaData: { [key: string]: { [key: string]: ({ [key: string]: [] } | string) } } = {
    "Center Node": {
        "CPA ID": ""
    },
    "DSC": {
        "File ID": "",
        "Curve": {
            "Temp./\u00b0C": [],
            "Time/min": [],
            "DSC/(mW/mg)": [],
            "Sensit./(uV/mW)": [],
            "Segment": []
        }
    },
    "FTIR": {
        "File ID": "",
        "Curve": {
            "Wavenumber/cm^-1": [],
            "Absorbance/A": []
        }
    },
    "Cryomicroscopy": {
        "File ID": ""
    },
    "Osmolality": {
        "File ID": ""
    },
    "Viscosity": {
        "File ID": ""
    }
}

export const defaultExp: { [key: string]: string } = {
    "Experiment ID": "",
    "CPA ID": "",
    "Process ID": "",
    "PreData Sample ID": "",
    "PostData Sample ID": ""
}

export const defaultProcess: { [key: string]: string } = {
    "Process ID": "",
    "Freezing device": "",
    "Cooling rate": "",
    "Preservation container": "",
    "Storage temperature": "",
    "Storage medium": "",
    "Storage duration": "",
    "Thawing temperature": "",
    "Washing steps": "",
    "Dilution medium": "",
    "Dilution factor": ""
}