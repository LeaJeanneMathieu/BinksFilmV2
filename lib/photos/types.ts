export type PhotoSeriesRecord = {
  id: string;
  slug: string;
  title: string;
  index: string;
  year: string;
  time: string;
  placeholder: "black" | "white";
  createdAt: string;
  updatedAt: string;
};

export type PhotoRecord = {
  id: string;
  seriesId: string;
  /** Chemin public, ex. /uploads/photos/abc.jpg */
  path: string;
  sortOrder: number;
  isPublic: boolean;
  createdAt: string;
};

export type PhotosStore = {
  series: PhotoSeriesRecord[];
  photos: PhotoRecord[];
};
