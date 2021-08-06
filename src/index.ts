import axios from 'axios';
import * as cheerio from 'cheerio';
import * as qs from 'qs';
import { mrcToObject } from 'himarc';

export async function query_book_name(name: string): Promise<string[]> {
  return await axios.get('https://www.nl.go.kr/NL/contents/search.do', {
    params: {
      pageNum: 1, pageSize: 30, srchTarget: 'total', kwd: name + '#'
    }
  }).then((data) => data.data)
    .then((data: string) => {
      const selector = cheerio.load(data);
      const targets = selector('a[href^="#viewKey"][title="새창열림"]');

      const result: string[] = [];
      targets.each((i, elem) => {
        const href: string = `${elem.attribs['href']}`;
        const params = qs.parse(href);
        result.push(`${params['#viewKey']},${params['viewType']}`);
      });

      return result;
    })
}


export async function download_marc(book_id: string): Promise<string> {
  return await axios.get('https://www.nl.go.kr/NL/marcDownload.do', {
    params: { downData: book_id }
  }).then((data) => data.data);
}


export function parse_marc(raw_marc: string) {
  return mrcToObject(raw_marc)
}
