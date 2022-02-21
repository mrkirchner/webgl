import { Content } from './content';

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
