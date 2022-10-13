import { Pipe, PipeTransform } from '@angular/core';
import { generateColors, HslColor } from 'src/utils/color-generator';
import { zip } from 'src/utils/zip';

interface Language {
  name : string,
  bytes : number,
  percentage : number,
  color : HslColor
}
export type { Language }

// Custom pipe for fun

@Pipe({
  name: 'repoLanguages'
})
export class RepoLanguagesPipe implements PipeTransform {

  transform(langs : Record<string, number>): Language[] {
    const total = Object.values(langs).reduce((a, b) => a + b, 0)
    const colors = generateColors(Object.values(langs).length)
    return zip(Object.entries(langs), colors).map(([[name, bytes], color]) => ({
      name,
      bytes,
      percentage : bytes / total * 100,
      color
    }))
  }

}
