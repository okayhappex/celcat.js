export const GROUPS = {
	MMI1: {
		A1: "G1-QJ2DMFYC5987",
		A2: "G1-PW2GUKMM5988",
		B1: "G1-HN2CHYNX5990",
		B2: "G1-QW2SJTJH5991",
	},
	MMI2: {
		A1: "G1-QS2QEJVB5994",
		A2: "G1-EG2LDXAM5995",
		B1: "G1-AE2BGJHX5997",
		B2: "G1-TM2VJCBU5998",
	},
	MMI3: {
		FA: {
			DW: {
				A1: "G1-TS2PGRAD6003",
				A2: "G1-KL2GMWYW6004",
			},
			CN: {
				A1: "G1-CC2LTGMX6000",
				A2: "G1-HW2LKCBM6001",
			},
		},
		FI: {
			CN: {
				A1: "G1-EB2URAPF6006",
				A2: "G1-JP2NSAYC6007",
			},
		},
	},
} as const;

export type GroupId = string;
