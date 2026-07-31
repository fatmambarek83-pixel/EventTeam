export interface GalleryImage {
  url: string;
  label: string;
  category: string;
}
export const IMAGE_GALLERY: GalleryImage[] = [
  { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80', label: 'Team building', category: 'Team building' },
  { url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80', label: 'Réunion d\'équipe', category: 'Team building' },
  { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', label: 'Sport en équipe', category: 'Sport' },
  { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80', label: 'Course à pied', category: 'Sport' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', label: 'Randonnée', category: 'Outdoor' },
  { url: 'https://images.unsplash.com/photo-1504198266287-1659872e6590?w=400&q=80', label: 'Camping', category: 'Outdoor' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', label: 'Atelier cuisine', category: 'Cuisine' },
  { url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80', label: 'Repas convivial', category: 'Cuisine' },
  { url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80', label: 'Concert / musique', category: 'Culture' },
  { url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80', label: 'Art & créativité', category: 'Culture' },
  { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80', label: 'Jeux de société', category: 'Jeux' },
  { url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80', label: 'Escape game', category: 'Jeux' },
  { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80', label: 'Conférence', category: 'Entreprise' },
  { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80', label: 'Networking', category: 'Entreprise' },
];

export function getRandomGalleryImage(): GalleryImage {
  const index = Math.floor(Math.random() * IMAGE_GALLERY.length);
  return IMAGE_GALLERY[index];
}
