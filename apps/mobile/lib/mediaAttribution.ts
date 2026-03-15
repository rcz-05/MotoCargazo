export type CuratedMediaId =
  | "seville_feria_market"
  | "seville_encarnacion_market"
  | "seville_triana_fish_counter"
  | "seville_triana_produce_stall"
  | "seville_triana_mixed_stall"
  | "seville_plaza_espana"
  | "spain_boqueria_meat_stand"
  | "spain_boqueria_meat_vendor"
  | "spain_boqueria_ham_display"
  | "spain_boqueria_fish_1"
  | "spain_boqueria_fish_2"
  | "spain_boqueria_fish_3"
  | "spain_boqueria_produce_1"
  | "spain_boqueria_produce_2";

type CuratedMedia = {
  url: string;
  sourcePage: string;
  license: string;
  credit: string;
  scope: "seville" | "spain";
};

type LocalAttribution = {
  localAsset: string;
  sourcePage: string;
  license: string;
  credit: string;
  scope: "seville" | "spain";
};

export const curatedMedia: Record<CuratedMediaId, CuratedMedia> = {
  seville_feria_market: {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sevilla_-_Mercado_de_Feria_8.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Sevilla_-_Mercado_de_Feria_8.jpg",
    license: "CC0",
    credit: "By Zarateman",
    scope: "seville"
  },
  seville_encarnacion_market: {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Mercado_de_la_Encarnaci%C3%B3n_02.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_de_la_Encarnaci%C3%B3n_02.jpg",
    license: "CC BY-SA 3.0",
    credit: "By Josedecadiz",
    scope: "seville"
  },
  seville_triana_fish_counter: {
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Mercado_triana_2015001.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_triana_2015001.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Anual",
    scope: "seville"
  },
  seville_triana_produce_stall: {
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Mercado_triana_2016002.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_triana_2016002.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Anual",
    scope: "seville"
  },
  seville_triana_mixed_stall: {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Mercado_de_triana_2018An02.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_de_triana_2018An02.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Anual",
    scope: "seville"
  },
  seville_plaza_espana: {
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Sevilla_-_Plaza_de_Espa%C3%B1a_41.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Sevilla_-_Plaza_de_Espa%C3%B1a_41.jpg",
    license: "CC BY-SA 4.0",
    credit: "By CarlosVdeHabsburgo",
    scope: "seville"
  },
  spain_boqueria_meat_stand: {
    url: "https://upload.wikimedia.org/wikipedia/commons/9/95/La_Boqueria%2C_meat_stand-01.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:La_Boqueria,_meat_stand-01.jpg",
    license: "CC BY-SA 2.0",
    credit: "By frankartculinary",
    scope: "spain"
  },
  spain_boqueria_meat_vendor: {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/A_meat_stand_in_La_Boqueria.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:A_meat_stand_in_La_Boqueria.jpg",
    license: "Public domain",
    credit: "By Umiami09",
    scope: "spain"
  },
  spain_boqueria_ham_display: {
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Jam%C3%B3n_ib%C3%A9rico_%28La_Boqueria%29.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Jam%C3%B3n_ib%C3%A9rico_(La_Boqueria).jpg",
    license: "CC BY-SA 4.0",
    credit: "By K.Weise",
    scope: "spain"
  },
  spain_boqueria_fish_1: {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/82/Fish_stalls_in_Mercat_de_la_Boqueria_%2801%29.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Fish_stalls_in_Mercat_de_la_Boqueria_(01).jpg",
    license: "CC BY-SA 4.0",
    credit: "By Moheen Reeyad",
    scope: "spain"
  },
  spain_boqueria_fish_2: {
    url: "https://upload.wikimedia.org/wikipedia/commons/4/49/Fish_stalls_in_Mercat_de_la_Boqueria_%2802%29.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Fish_stalls_in_Mercat_de_la_Boqueria_(02).jpg",
    license: "CC BY-SA 4.0",
    credit: "By Moheen Reeyad",
    scope: "spain"
  },
  spain_boqueria_fish_3: {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/61/La_Boqueria_-_fish_%26_seafood.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:La_Boqueria_-_fish_%26_seafood.jpg",
    license: "CC BY-SA 3.0",
    credit: "By Gveret Tered",
    scope: "spain"
  },
  spain_boqueria_produce_1: {
    url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Puesto_de_frutas_en_el_Mercado_de_La_Boquer%C3%ADa_en_Barcelona.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Puesto_de_frutas_en_el_Mercado_de_La_Boquer%C3%ADa_en_Barcelona.jpg",
    license: "CC BY 4.0",
    credit: "By Chabe01",
    scope: "spain"
  },
  spain_boqueria_produce_2: {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/51/La_Boqueria-_fruits_%26_vegetables.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:La_Boqueria-_fruits_%26_vegetables.jpg",
    license: "CC BY-SA 3.0",
    credit: "By Zarateman",
    scope: "spain"
  }
};

export const providerLocalMediaAttributions: Record<string, LocalAttribution> = {
  provider_meat_01: {
    localAsset: "assets/catalog/providers/meat/meat_01_boqueria_stand.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:La_Boqueria,_meat_stand-01.jpg",
    license: "CC BY-SA 2.0",
    credit: "By frankartculinary",
    scope: "spain"
  },
  provider_meat_02: {
    localAsset: "assets/catalog/providers/meat/meat_02_boqueria_vendor.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:A_meat_stand_in_La_Boqueria.jpg",
    license: "Public domain",
    credit: "By Umiami09",
    scope: "spain"
  },
  provider_meat_03: {
    localAsset: "assets/catalog/providers/meat/meat_03_jamon_display.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Jam%C3%B3n_ib%C3%A9rico_(La_Boqueria).jpg",
    license: "CC BY-SA 4.0",
    credit: "By K.Weise",
    scope: "spain"
  },
  provider_meat_04: {
    localAsset: "assets/catalog/providers/meat/meat_04_butcher_stall.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Butcher%27s_stall_at_the_Mercat_de_St._Josep_in_Barcelona.jpg",
    license: "CC BY-SA 4.0",
    credit: "By DuckWrangler97",
    scope: "spain"
  },
  provider_meat_05: {
    localAsset: "assets/catalog/providers/meat/meat_05_feria_counter.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Sevilla_-_Mercado_de_Feria_8.jpg",
    license: "CC0",
    credit: "By Zarateman",
    scope: "seville"
  },
  provider_meat_06: {
    localAsset: "assets/catalog/providers/meat/meat_06_triana_counter.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_triana_2015001.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Anual",
    scope: "seville"
  },
  provider_seafood_01: {
    localAsset: "assets/catalog/providers/seafood/seafood_01_boqueria_fish_1.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Fish_stalls_in_Mercat_de_la_Boqueria_(01).jpg",
    license: "CC BY-SA 4.0",
    credit: "By Moheen Reeyad",
    scope: "spain"
  },
  provider_seafood_02: {
    localAsset: "assets/catalog/providers/seafood/seafood_02_boqueria_fish_2.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Fish_stalls_in_Mercat_de_la_Boqueria_(02).jpg",
    license: "CC BY-SA 4.0",
    credit: "By Moheen Reeyad",
    scope: "spain"
  },
  provider_seafood_03: {
    localAsset: "assets/catalog/providers/seafood/seafood_03_boqueria_mix.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:La_Boqueria_-_fish_%26_seafood.jpg",
    license: "CC BY-SA 3.0",
    credit: "By Gveret Tered",
    scope: "spain"
  },
  provider_seafood_04: {
    localAsset: "assets/catalog/providers/seafood/seafood_04_triana_counter.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_triana_2015001.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Anual",
    scope: "seville"
  },
  provider_seafood_05: {
    localAsset: "assets/catalog/providers/seafood/seafood_05_triana_halles.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Halles_March%C3%A9_Triana_-_S%C3%A9ville_(ES61)_-_2023-04-24_-_1.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Chabe01",
    scope: "seville"
  },
  provider_seafood_06: {
    localAsset: "assets/catalog/providers/seafood/seafood_06_boqueria_stall.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercat_de_la_Boqueria_26.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Nicholas Gemini",
    scope: "spain"
  },
  provider_produce_01: {
    localAsset: "assets/catalog/providers/produce/produce_01_triana_stall.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_triana_2016002.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Anual",
    scope: "seville"
  },
  provider_produce_02: {
    localAsset: "assets/catalog/providers/produce/produce_02_barcelona_fruit_a.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Fruit_stall_at_Barcelona_market_(2925474480).jpg",
    license: "CC BY-SA 2.0",
    credit: "By Andy Mitchell",
    scope: "spain"
  },
  provider_produce_03: {
    localAsset: "assets/catalog/providers/produce/produce_03_barcelona_fruit_b.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Fruit_stall_at_Barcelona_market_(2929343065).jpg",
    license: "CC BY-SA 2.0",
    credit: "By Andy Mitchell",
    scope: "spain"
  },
  provider_produce_04: {
    localAsset: "assets/catalog/providers/produce/produce_04_barcelona_fruit_c.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Fruit_stall_at_Barcelona_market_(2929344665).jpg",
    license: "CC BY-SA 2.0",
    credit: "By Andy Mitchell",
    scope: "spain"
  },
  provider_produce_05: {
    localAsset: "assets/catalog/providers/produce/produce_05_spanish_veg.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Spanish_fruit_and_veg_market_(49881773941).jpg",
    license: "CC BY 2.0",
    credit: "By Mike McBey",
    scope: "spain"
  },
  provider_produce_06: {
    localAsset: "assets/catalog/providers/produce/produce_06_boqueria_stall.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercat_de_la_Boqueria_07.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Nicholas Gemini",
    scope: "spain"
  },
  provider_mixed_01: {
    localAsset: "assets/catalog/providers/mixed/mixed_01_triana_interior.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_de_triana_2018An02.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Anual",
    scope: "seville"
  },
  provider_mixed_02: {
    localAsset: "assets/catalog/providers/mixed/mixed_02_triana_general.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_de_Triana_(1).jpg",
    license: "CC BY 4.0",
    credit: "By Alberto-g-rovi",
    scope: "seville"
  },
  provider_mixed_03: {
    localAsset: "assets/catalog/providers/mixed/mixed_03_feria_general.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Sevilla_-_Mercado_de_Feria_6.jpg",
    license: "CC0",
    credit: "By Zarateman",
    scope: "seville"
  },
  provider_mixed_04: {
    localAsset: "assets/catalog/providers/mixed/mixed_04_feria_vendor.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_de_Feria_01.jpg",
    license: "CC BY-SA 4.0",
    credit: "By CarlosVdeHabsburgo",
    scope: "seville"
  },
  provider_mixed_05: {
    localAsset: "assets/catalog/providers/mixed/mixed_05_feria_hall.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_de_Feria_03.jpg",
    license: "CC BY-SA 4.0",
    credit: "By CarlosVdeHabsburgo",
    scope: "seville"
  },
  provider_mixed_06: {
    localAsset: "assets/catalog/providers/mixed/mixed_06_feria_halles.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Halles_Calle_Feria_-_S%C3%A9ville_(ES61)_-_2023-04-24_-_1.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Chabe01",
    scope: "seville"
  },
  provider_mixed_07: {
    localAsset: "assets/catalog/providers/mixed/mixed_02_market.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Barcelona_Mercat_Boqueria_21_(8311578914).jpg",
    license: "CC BY-SA 2.0",
    credit: "By Alain Rouiller",
    scope: "spain"
  },
  provider_mixed_08: {
    localAsset: "assets/catalog/providers/mixed/mixed_03_market.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Barcelona_Mercat_Boqueria_7_(8440961820).jpg",
    license: "CC BY-SA 2.0",
    credit: "By Alain Rouiller",
    scope: "spain"
  },
  provider_mixed_09: {
    localAsset: "assets/catalog/providers/mixed/mixed_04_market.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercat_de_la_Boqueria_07.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Nicholas Gemini",
    scope: "spain"
  },
  provider_mixed_10: {
    localAsset: "assets/catalog/providers/mixed/mixed_05_market.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercat_de_la_Boqueria_13.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Nicholas Gemini",
    scope: "spain"
  },
  provider_mixed_11: {
    localAsset: "assets/catalog/providers/mixed/mixed_06_market.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercat_de_la_Boqueria_19.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Nicholas Gemini",
    scope: "spain"
  },
  provider_meat_07: {
    localAsset: "assets/catalog/providers/meat/meat_07_antequera_butcher.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Antequera_-_Butcher%27s_shop.jpg",
    license: "CC BY-SA 3.0",
    credit: "By Kulmalukko",
    scope: "spain"
  },
  provider_meat_08: {
    localAsset: "assets/catalog/providers/meat/meat_08_boqueria_butcher_stall.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Butcher%27s_stall_at_the_Mercat_de_St._Josep_in_Barcelona.jpg",
    license: "CC BY-SA 4.0",
    credit: "By DuckWrangler97",
    scope: "spain"
  },
  provider_meat_09: {
    localAsset: "assets/catalog/providers/meat/meat_09_mercado_paz_counter.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Madrid_-_Mercado_de_la_Paz_09.jpg",
    license: "CC0",
    credit: "By Zarateman",
    scope: "spain"
  },
  provider_meat_10: {
    localAsset: "assets/catalog/providers/meat/meat_10_valencia_charcuteria.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Charcuteria_-_Mercat_Central_de_Val%C3%A8ncia.JPG",
    license: "CC BY-SA 3.0",
    credit: "By Jordiferrer",
    scope: "spain"
  },
  provider_seafood_07: {
    localAsset: "assets/catalog/providers/seafood/seafood_07_triana_fish_stall.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_triana_2015001.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Anual",
    scope: "seville"
  },
  provider_seafood_08: {
    localAsset: "assets/catalog/providers/seafood/seafood_08_cadiz_market.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:C%C3%A1diz_-_Mercado_Central_de_Abastos_-_54909230897.jpg",
    license: "CC BY 4.0",
    credit: "By Jorge Franganillo",
    scope: "spain"
  },
  provider_seafood_09: {
    localAsset: "assets/catalog/providers/seafood/seafood_09_andalucia_seafood.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_Victoria_La_Gamba_de_ORO_Stand_de_pescado_y_marisco.jpg",
    license: "CC BY-SA 3.0",
    credit: "By Lagambadeoro",
    scope: "spain"
  },
  provider_seafood_10: {
    localAsset: "assets/catalog/providers/seafood/seafood_10_boqueria_fish_market.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercat_de_la_Boqueria_Sant_Josep_16.JPG",
    license: "CC BY-SA 2.5",
    credit: "By Bohringer Friedrich",
    scope: "spain"
  },
  provider_produce_07: {
    localAsset: "assets/catalog/providers/produce/produce_07_triana_frutas.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_triana_2016002.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Anual",
    scope: "seville"
  },
  provider_produce_08: {
    localAsset: "assets/catalog/providers/produce/produce_08_spanish_greengrocer.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:SpanishGreengrocerDisplay.jpg",
    license: "CC BY-SA 4.0",
    credit: "By Martinvl",
    scope: "spain"
  },
  provider_mixed_12: {
    localAsset: "assets/catalog/providers/mixed/mixed_07_triana_interior_a.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_de_Triana_(1).jpg",
    license: "CC BY 4.0",
    credit: "By Alberto-g-rovi",
    scope: "seville"
  },
  provider_mixed_13: {
    localAsset: "assets/catalog/providers/mixed/mixed_08_encarnacion_interior.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_de_la_Encarnaci%C3%B3n_01.jpg",
    license: "CC BY-SA 4.0",
    credit: "By CarlosVdeHabsburgo",
    scope: "seville"
  },
  provider_mixed_14: {
    localAsset: "assets/catalog/providers/mixed/mixed_09_arenal_interior.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_del_Arenal_(1).jpg",
    license: "CC BY 4.0",
    credit: "By Alberto-g-rovi",
    scope: "seville"
  },
  provider_mixed_15: {
    localAsset: "assets/catalog/providers/mixed/mixed_10_feria_interior.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mercado_de_Feria_01.jpg",
    license: "CC BY-SA 4.0",
    credit: "By CarlosVdeHabsburgo",
    scope: "seville"
  }
};

export const curatedMediaAttributions = [
  ...Object.entries(curatedMedia).map(([id, media]) => ({ id: id as CuratedMediaId, ...media })),
  ...Object.entries(providerLocalMediaAttributions).map(([id, media]) => ({ id, ...media }))
];
