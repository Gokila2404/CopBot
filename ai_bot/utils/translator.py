from googletrans import Translator

translator = Translator()

def translate_text(text, lang="en"):
    return translator.translate(text, dest=lang).text
