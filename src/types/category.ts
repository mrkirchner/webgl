import { Content } from './content';

// TODO
// Incomplete Set Interface
export interface Category {
  set: {
    setId: string;
    refId?: string;
    text: {
      title: {
        full: {
          set: {
            default: {
              content: string;
              language: string;
            };
          };
        };
      };
    };

    items: Content[];
  };
}
