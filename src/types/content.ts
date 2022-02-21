export interface Content {
  contentId?: string;
  collectionId?: string;
  ratings?: ContentRating[];
  image: {
    tile: {
      1.78: {
        series?: {
          default: {
            url: string;
          };
        };
        program?: {
          default: {
            url: string;
          };
        };
        default?: {
          default: {
            url: string;
          };
        };
      };
    };
    background?: {
      1.78: {
        series?: {
          default: {
            url: string;
          };
        };
        program?: {
          default: {
            url: string;
          };
        };
        default?: {
          default: {
            url: string;
          };
        };
      };
    };
    background_details?: {
      1.78: {
        series?: {
          default: {
            url: string;
          };
        };
        program?: {
          default: {
            url: string;
          };
        };
        default?: {
          default: {
            url: string;
          };
        };
      };
    };
    hero_collection?: {
      1.78: {
        series?: {
          default: {
            url: string;
          };
        };
        program?: {
          default: {
            url: string;
          };
        };
        default?: {
          default: {
            url: string;
          };
        };
      };
    };
    text: {
      title: {
        full: {
          series?: {
            default: {
              content: string;
              language: string;
            };
          };
          program?: {
            default: {
              content: string;
              language: string;
            };
          };
          default?: {
            default: {
              content: string;
              language: string;
            };
          };
        };
      };
    };
  };
  text: {
    title: {
      full: {
        series?: {
          default: {
            content: string;
            language: string;
          };
        };
        program?: {
          default: {
            content: string;
            language: string;
          };
        };
        default?: {
          default: {
            content: string;
            language: string;
          };
        };
      };
    };
  };
}

export interface ContentRating {
  value: string;
  description: string;
}
