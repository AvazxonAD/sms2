export const DateFilt = () => {
  const dateInfo = new Date();
  const date = dateInfo.toString();

  const day = date.slice(8, 10);

  return `${dateInfo.getFullYear()}-yil/${
    dateInfo.getMonth() + 1
  }-oy/${day}-kun`;
};

export const extractNameAndSumma = (
  items: any
): { name: string; summa: number }[] => {
  return items.map((item: any) => ({ name: item.name, summa: item.summa }));
};
export const extractNameAndSumma2 = (
  items: any
): { name: string; number: number }[] => {
  return items.map((item: any) => ({ name: item.name, number: item.number }));
};
export const extractNmae = (items: any): { name: string; summa: number }[] => {
  return items.map((item: any) => ({ name: item.name }));
};

type InputObject = {
  name: string;
  summa: number;
};

type OutputObject = {
  name: string;
  coefficient: number;
};

export function transformArray(arr: InputObject[]): OutputObject[] {
  return arr.map((obj) => ({
    name: obj.name,
    coefficient: obj.summa,
  }));
}

export const FiltDate = (date: any) => {
  return `${date.$y}-${
    `${date.$M + 1}`.length > 1 ? date.$M + 1 : `0${date.$M + 1}`
  }-${`${date.$D}`.length > 1 ? date.$D : `0${date.$D}`}`;
};

interface Rank {
  kodZvaniya: number;
  zvaniye: string;
  sokrashenie: string;
}

export const ranksData: Rank[] = [
  { kodZvaniya: 1, zvaniye: "Вольнонаемный", sokrashenie: "ВН" },
  { kodZvaniya: 2, zvaniye: "Рядовой", sokrashenie: "РД" },
  { kodZvaniya: 3, zvaniye: "Младший сержант", sokrashenie: "МС" },
  { kodZvaniya: 4, zvaniye: "Сержант", sokrashenie: "СР" },
  { kodZvaniya: 5, zvaniye: "Старший сержант", sokrashenie: "СС" },
  { kodZvaniya: 6, zvaniye: "Лейтенант", sokrashenie: "ЛТ" },
  { kodZvaniya: 12, zvaniye: "Старший лейтенант", sokrashenie: "СЛ" },
  { kodZvaniya: 13, zvaniye: "Капитан", sokrashenie: "КН" },
  { kodZvaniya: 14, zvaniye: "Майор", sokrashenie: "МР" },
  { kodZvaniya: 15, zvaniye: "Подполковник", sokrashenie: "ПП" },
  { kodZvaniya: 16, zvaniye: "Полковник", sokrashenie: "ПК" },
  { kodZvaniya: 17, zvaniye: "Генерал майор", sokrashenie: "ГМ" },
  { kodZvaniya: 18, zvaniye: "Генерал лейтенант", sokrashenie: "ГЛТ" },
  { kodZvaniya: 19, zvaniye: "Генерал полковник", sokrashenie: "ГП" },
];

export function formatString(input: any): any {
  if (input) {
    // Ensure the string is at least two characters long
    if (input.length < 2) {
      return input;
    }
   
    // Split the first two characters and join with a space
    let result = input.toString().slice(0, 2);

    // Process the remaining characters in chunks of three
    const remaining = input.toString().slice(2);
    for (let i = 0; i < remaining.length; i += 3) {
      result += " " + remaining.slice(i, i + 3);
    }

    return result;
  }
}

export function formatNumber(value: any): any {
  if (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  } else {
    return 0;
  }
}
export function formatStringWithSpaces(input: string | number): string {
  const str = input.toString();
  let result = '';

  for (let i = 0; i < str.length; i++) {
    result += str[i];
    if ((i + 1) % 3 === 0 && i !== str.length - 1) {
      result += ' ';
    }
  }

  return result;
}

export const latinToCyrillic = (latin: string): string => {
  const map: { [key: string]: string } = {
    a: "а",
    A: "А",
    b: "б",
    B: "Б",
    c: "ц",
    C: "Ц",
    d: "д",
    D: "Д",
    e: "е",
    E: "Е",
    f: "ф",
    F: "Ф",
    g: "г",
    G: "Г",
    "g'": "ғ",
    "G'": "Ғ",
    h: "ҳ",
    H: "Ҳ",
    i: "и",
    I: "И",
    j: "ж",
    J: "Ж",
    k: "к",
    K: "К",
    l: "л",
    L: "Л",
    m: "м",
    M: "М",
    n: "н",
    N: "Н",
    o: "о",
    O: "О",
    "o'": "ў",
    "O'": "Ў",
    p: "п",
    P: "П",
    q: "қ",
    Q: "Қ",
    r: "р",
    R: "Р",
    s: "с",
    S: "С",
    t: "т",
    T: "Т",
    u: "у",
    U: "У",
    v: "в",
    V: "В",
    w: "ў",
    W: "Ў",
    x: "х",
    X: "Х",
    y: "й",
    Y: "Й",
    z: "з",
    Z: "З",
    sh: "ш",
    Sh: "Ш",
    SH: "Ш",
    ch: "ч",
    Ch: "Ч",
    CH: "Ч",
    Ye: "Е",
    YE: "Е",
    ye: "е",
    Yo: "Ё",
    YO: "Ё",
    yo: "ё",
    Yu: "Ю",
    YU: "Ю",
    yu: "ю",
    Ya: "Я",
    YA: "Я",
    ya: "я",
    " ": " ",
    "y'": "ь",
    "Y'": "ь",
    "'": "ь",
  };

  return latin.replace(
    /sh|Sh|SH|ch|Ch|CH|g'|G'|o'|O'|Ye|YE|ye|Yo|YO|yo|Yu|YU|yu|Ya|YA|ya|y'|Y'|'|./g,
    (char) => map[char] || char
  );
};

export const cyrillicToLatin = (cyrillic: string): string => {
  const map: { [key: string]: string } = {
    а: "a",
    А: "A",
    б: "b",
    Б: "B",
    ц: "c",
    Ц: "C",
    д: "d",
    Д: "D",
    е: "e",
    Е: "E",
    ф: "f",
    Ф: "F",
    г: "g",
    Г: "G",
    ғ: "g'",
    Ғ: "G'",
    ҳ: "h",
    Ҳ: "H",
    и: "i",
    И: "I",
    ж: "j",
    Ж: "J",
    к: "k",
    К: "K",
    л: "l",
    Л: "L",
    м: "m",
    М: "M",
    н: "n",
    Н: "N",
    о: "o",
    О: "O",
    ў: "o'",
    Ў: "O'",
    п: "p",
    П: "P",
    қ: "q",
    Қ: "Q",
    р: "r",
    Р: "R",
    с: "s",
    С: "S",
    т: "t",
    Т: "T",
    у: "u",
    У: "U",
    в: "v",
    В: "V",
    х: "x",
    Х: "X",
    й: "y",
    Й: "Y",
    з: "z",
    З: "Z",
    ш: "sh",
    Ш: "Sh",
    ч: "ch",
    Ч: "Ch",
    " ": " ",
  };

  return cyrillic.replace(/ш|ч|ғ|ў|./gi, (char) => map[char] || char);
};