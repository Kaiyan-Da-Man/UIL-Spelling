export interface WordDictionary {
	meta: {
		id: string;
		uuid: string;
		sort: string;
		src: string;
		section: string;
		stems: Array<string>;
		offensive: boolean;
	};
	hom?: number;
	hwi: {
		hw: string;
		prs?: Array<{
			mw: string;
			sound: {
				audio: string;
				ref: string;
				stat: string;
			};
		}>;
	};
	fl: string;
	def: Array<{
		sseq: Array<Array<[string, any]>>;
		vd?: string;
	}>;
	et?: Array<Array<string>>;
	date?: string;
	shortdef: Array<string>;
	ins?: Array<{
		ifc?: string;
		if: string;
		prs?: Array<{
			mw: string;
			sound: {
				audio: string;
				ref: string;
				stat: string;
			};
		}>;
	}>;
	uros?: Array<{
		ure: string;
		fl: string;
		prs?: Array<{
			mw: string;
			sound: {
				audio: string;
				ref: string;
				stat: string;
			};
		}>;
	}>;
	dros?: Array<{
		drp: string;
		vrs: Array<{
			vl: string;
			va: string;
		}>;
		def: Array<{
			sseq: Array<
				Array<
					[
						string,
						{
							dt: Array<Array<string>>;
						},
					]
				>
			>;
		}>;
	}>;
}
