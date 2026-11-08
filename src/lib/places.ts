// Villes et communes proposées dans les formulaires d'inscription et de profil.
export const CITIES = ["Abengourou", "Abidjan", "Aboisso", "Afféry", "Agboville", "Agnibilékrou", "Assinie", "Bangolo", "Bingerville", "Bocanda", "Bondoukou", "Bouaflé", "Bouaké", "Bouna", "Boundiali", "Dabou", "Daloa", "Danané", "Daoukro", "Dimbokro", "Divo", "Duékoué", "Ferkessédougou", "Gagnoa", "Grand-Bassam", "Guiglo", "Issia", "Jacqueville", "Katiola", "Korhogo", "Man", "Mankono", "Odienné", "Ouangolodougou", "Oumé", "San-Pédro", "Sassandra", "Séguéla", "Sinfra", "Soubré", "Tabou", "Tengréla", "Tiassalé", "Touba", "Toumodi", "Yamoussoukro", "Zuénoula"];

const KNOWN_COMMUNES = ["Abobo", "Adjamé", "Anyama", "Attécoubé", "Bingerville", "Brofodoumé", "Cocody", "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Songon", "Treichville", "Yopougon"].sort();

// « Autre » reste à la fin : on ne connaît pas les communes de toutes les villes.
export const OTHER_COMMUNE = "Autre";
export const COMMUNES = [...KNOWN_COMMUNES, OTHER_COMMUNE];

/** Commune à afficher ou à chercher : « Autre » ne renseigne sur aucun lieu. */
export const realCommune = (commune?: string | null) => (commune && commune !== OTHER_COMMUNE ? commune : null);

/** « Ville, Commune », ou seulement la ville si la commune est « Autre ». */
export const placeLabel = (city?: string | null, commune?: string | null) => [city, realCommune(commune)].filter(Boolean).join(", ");
