/**
 * Бредогенератор. Непосредственно сам генератор бреда
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 1.0
 * @copyright Artem Kuzvesov 2013
 * 
 */

/**
 * [bredogenerator генератор бреда]
 * @param  {[array]}  dictionary      [словарь, на основании которого будет генерироваться бред]
 * @param  {[array]}  indexDictionary [вспомогательная индексированная версия этого же словаря]
 * @param  {[number]} dictionarySize  [размер словаря]
 * @param  {[number]} minWordsCount   [минимальное количество слов в предложеннии]
 * @param  {[number]} maxWordsCount   [максимальное количество слов в предложении]
 * @param  {[number]} minProfferCount [минимальное количество абзацев]
 * @param  {[number]} maxProfferCount [максимальное количество абзацев]
 * @return {[array]}                  [бредотекст]
 */
function bredogenerator(dictionary, indexDictionary, dictionarySize, minWordsCount, maxWordsCount, minProfferCount, maxProfferCount) { // бредогенератор текста
    var text           = []; // массив для хранения итогового текста
    var startWords     = collocation(indexDictionary, dictionarySize);
    startWords[0]      = capitaliseFirstLetter(startWords[0]);
    text               = text.concat(startWords);

    var textSize       = text.length-1; // длина массива, с текстом на выход
    var doubleWords    = text[textSize-1] + ' ' + text[textSize];
    var randomWords    = randomizer(minWordsCount, maxWordsCount); // случайное количество слов в абзаце
    var randomProffer  = randomizer(minProfferCount, maxProfferCount); // случайное количество предложений в абзаце
    var countWords     = 2; // счечик слов
    var countProffer   = 0; // счечик предложений
    var newCollocation = '';
    var generate       = true;

    while(generate) {
        if (dictionary[doubleWords]) {
            var suffixN = 0; // порядковый номер суффикса в массиве по умолчанию
            var suffixSize = dictionary[doubleWords].length - 1;

            if (suffixSize > 0) {
                suffixN = randomizer(0, suffixSize);
            };

            text.push(dictionary[doubleWords][suffixN]);
            textSize++;
            countWords++;

            if (countWords >= randomWords) {
                if ((text[textSize].search(/[.,:;!\?]/)+1) || (text[textSize-1].search(/[.,:;!\?]/)+1)) {
                    text.pop();text.pop();
                    newCollocation = collocation(indexDictionary, dictionarySize);
                    text = text.concat(newCollocation);
                }

                randomWords = randomizer(minWordsCount, maxWordsCount);
                text.push('.');
                textSize++;
                countProffer++;

                if (countProffer >= randomProffer) {
                    generate = false;
                } else {             
                    newCollocation = collocation(indexDictionary, dictionarySize);
                    newCollocation[0] = capitaliseFirstLetter(newCollocation[0]);
                    text = text.concat(newCollocation);
                    textSize += 2;
                    countWords = 2;
                }
            } else {
                if ((text[textSize-1].search(/[.!\?]/)+1)) {
                    countProffer++;
                    if (countProffer >= randomProffer) {
                        text.pop();
                        generate = false;
                    } else {
                        text[textSize] = capitaliseFirstLetter(text[textSize]);
                        randomWords = randomizer(minWordsCount, maxWordsCount);
                        countWords = 1;
                    }
                }
            }
        } else {
            newCollocation = collocation(indexDictionary, dictionarySize);
            if(text[textSize].search(/[.,!\?]/)+1) {
                newCollocation[0]   = capitaliseFirstLetter(newCollocation[0]);
            }
            text = text.concat(newCollocation);
            textSize += 2;
            countWords += 2;
        }
        doubleWords = text[textSize-1] + ' ' + text[textSize];
    }
    
    return text;
}