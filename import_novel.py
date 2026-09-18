#!/usr/bin/env python3
"""
Skript zum Importieren von Novels aus Twee-Format in das KITE-Format.

Verwendung:
    python import_novel.py <source_dir> [--append]
"""

import argparse
import json
import os
import re
import sys
from collections import Counter


def load_character_info(character_info_path=None):
    """Lädt die character-info.json und gibt ein Dict {name: id} zurück"""
    if character_info_path is None:
        character_info_path = os.path.join(os.path.dirname(__file__), 'app', 'assets', 'json', 'character-info.json')
    
    if not os.path.exists(character_info_path):
        character_info_path = os.path.join(os.path.dirname(__file__), '..', 'app', 'assets', 'json', 'character-info.json')
    
    try:
        with open(character_info_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        name_to_id = {}
        for char in data.get('characters', []):
            if char.get('name'):
                name_to_id[char['name']] = char['id']
        return name_to_id
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Warnung: character-info.json nicht geladen: {e}")
        return {}


EXPRESSION_MAP = {
    'Scared': 0, 'Defeated': 1, 'Dissatisfied': 2, 'Rejecting': 3,
    'Amazed': 4, 'Questioning': 5, 'Critical': 6, 'SmilingBig': 7,
    'Laughing': 8, 'Smiling': 9, 'NeutralRelaxed': 10, 'Neutral': 11, 'Proud': 12,
}

BIAS_MAP = {
    'PerformanceAttributionBias': 'Verzerrung der Leistungszuordnung',
    'UnconsciousBiasInCommunication': 'Unbewusste Verzerrung in der Kommunikation',
    'ConfirmationBias': 'Bestätigungsfehler',
    'AccessToFinancing': 'Zugang zu Finanzierung',
    'UndervaluationFemaleManagedCompany': 'Unterbewertung frauengeführter Unternehmen',
    'BiasInThePerceptionOfLeadershipSkills': 'Verzerrung in der Wahrnehmung von Führungsfähigkeiten',
    'TightropeBias': 'Tightrope-Bias',
}

UMLAUT_CORRECTIONS = {
    'õ': 'ö', 'Õ': 'Ö', '³': 'ü', '÷': 'ö', '▀': 'ä', 'Æ': 'Ä',
    'f³r': 'für', 'F³r': 'Für', 'Gr³ndung': 'Gründung', 'Gr³nder': 'Gründer',
    'Gr³nderin': 'Gründerin', 'erwõhnt': 'erwähnt', 'Geschõfts': 'Geschäfts',
    'F³hrerin': 'Führerin', 'F³hrung': 'Führung', 'au▀ergew÷hnlich': 'außergewöhnlich',
    'gr³nden': 'gründen', 'Gr³nden': 'Gründen', 'Selbststõndig': 'Selbstständig',
    'selbststõndig': 'selbstständig', 'Ratschlõge': 'Ratschläge', 'ratschlõge': 'ratschläge',
    'Terminõnderung': 'Terminänderung', 'terminõnderung': 'terminänderung',
    'K÷nnten': 'Könnten', 'k÷nnten': 'könnten', 'bestõtigen': 'bestätigen',
    'Bestõtigen': 'Bestätigen', 'wõre': 'wäre', 'Wõre': 'Wäre', 'hõtte': 'hätte',
    'Hõtte': 'Hätte', 'W³rde': 'Würde', 'w³rde': 'würde', 'zur³ckkommen': 'zurückkommen',
    'Zur³ckkommen': 'Zurückkommen', 'Sch÷nen': 'Schönen', 'sch÷nen': 'schönen',
    'Sch÷n': 'Schön', 'sch÷n': 'schön', 'W³rden': 'Würden', 'w³rden': 'würden',
    'M÷glichkeit': 'Möglichkeit', 'm÷glich': 'möglich', 'Untern÷hmen': 'Unternehmen',
    'untern÷hmen': 'unternehmen', 'Probl÷m': 'Problem', 'probl÷m': 'problem',
    'L÷sung': 'Lösung', 'l÷sung': 'lösung',
}


def fix_umlaute(text):
    if not text:
        return text
    for wrong, correct in UMLAUT_CORRECTIONS.items():
        text = text.replace(wrong, correct)
    return text


def parse_metadata(filepath):
    """Parsed die Metadaten aus visual_novel_meta_data.txt"""
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            content = f.read().strip()
    except UnicodeDecodeError:
        with open(filepath, 'r', encoding='latin-1') as f:
            content = f.read().strip()
    
    content = fix_umlaute(content)
    
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError(f"Konnte Metadaten nicht parsen: {filepath}")


def parse_twee_passages(filepath):
    """Parsed die Twee-Datei und extrahiert Passagen."""
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(filepath, 'r', encoding='latin-1') as f:
            content = f.read()
        content = fix_umlaute(content)
    
    passages = []
    current_passage = None
    current_tags = ''
    current_lines = []
    
    passage_pattern = re.compile(r'^::\s*([^\n\[\{]+)(?:\[([^\]]+)\])?\s*(?:\{[^\}]+\})?\s*$')
    
    for line in content.split('\n'):
        stripped = line.strip()
        if not stripped:
            continue
        
        stripped_fixed = fix_umlaute(stripped)
        
        match = passage_pattern.match(stripped)
        if match:
            passage_name = match.group(1).strip()
            passage_name_fixed = fix_umlaute(passage_name)
            
            if passage_name_fixed in ['StoryTitle', 'StoryData']:
                current_passage = None
                continue
            
            if current_passage is not None:
                passages.append({
                    'name': fix_umlaute(current_passage),
                    'tags': fix_umlaute(current_tags),
                    'lines': [fix_umlaute(l) for l in current_lines]
                })
            current_passage = passage_name_fixed
            current_tags = match.group(2) if match.group(2) else ''
            current_lines = []
        elif current_passage is not None:
            current_lines.append(stripped_fixed)
    
    if current_passage is not None:
        passages.append({
            'name': fix_umlaute(current_passage),
            'tags': fix_umlaute(current_tags),
            'lines': [fix_umlaute(l) for l in current_lines]
        })
    
    return passages


def extract_links_from_text(text):
    """Extrahiere alle Links aus einem Text."""
    text = fix_umlaute(text)
    link_pattern = re.compile(r'\[\[(.*?)\]\]')
    links = []
    clean_text = text
    
    for match in link_pattern.finditer(text):
        full_text = match.group(1).strip()
        full_text = fix_umlaute(full_text)
        
        if '->' in full_text:
            parts = full_text.split('->', 1)
            link_text = parts[0].strip()
            target = parts[1].strip()
        elif '|' in full_text:
            parts = full_text.split('|', 1)
            link_text = parts[0].strip()
            target = parts[1].strip()
        else:
            link_text = full_text
            target = None
        
        links.append({'text': link_text, 'target': target})
        clean_text = clean_text.replace(match.group(0), '')
    
    return clean_text.strip(), links


def process_passage(passage, start_passage):
    """Verarbeitet eine Passage und gibt Events, Links und End-Flag zurück."""
    passage_name = passage['name']
    lines = passage['lines']
    
    events = []
    current_character = None
    current_expression = None
    current_text_parts = []
    passage_links = []
    passage_has_end = False
    
    macro_pattern = re.compile(r'^\s*>>([^|<>]+)(?:\|([^<>]*))?<<\s*$')
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        
        # Prüfe auf Link in eigener Zeile
        if stripped.startswith('[[') and stripped.endswith(']]'):
            full_text = stripped[2:-2].strip()
            if '->' in full_text:
                parts = full_text.split('->', 1)
                text = parts[0].strip()
                target = parts[1].strip()
            elif '|' in full_text:
                parts = full_text.split('|', 1)
                text = parts[0].strip()
                target = parts[1].strip()
            else:
                text = full_text
                target = None
            passage_links.append({'text': text, 'target': target})
            continue
        
        # Prüfe auf Makro
        macro_match = macro_pattern.match(stripped)
        if macro_match:
            macro_name = macro_match.group(1).strip()
            macro_value = macro_match.group(2).strip() if macro_match.group(2) else None
            
            # Speichere aktuellen Text als Event
            if current_character is not None and current_text_parts:
                text = ' '.join(current_text_parts).strip()
                clean_text, inline_links = extract_links_from_text(text)
                passage_links.extend(inline_links)
                events.append({
                    'type': 'dialog',
                    'character': current_character,
                    'expression': current_expression,
                    'text': clean_text
                })
                current_text_parts = []
            
            # Verarbeite Makro
            if macro_name == '--':
                if current_character is not None and current_text_parts:
                    text = ' '.join(current_text_parts).strip()
                    clean_text, inline_links = extract_links_from_text(text)
                    passage_links.extend(inline_links)
                    events.append({
                        'type': 'dialog',
                        'character': current_character,
                        'expression': current_expression,
                        'text': clean_text
                    })
                    current_text_parts = []
            elif macro_name in ['End', 'Ende']:
                passage_has_end = True
            elif macro_name in ['Character1', 'Character2', 'Character3', 'Player', 'Info', 'Notarin']:
                current_character = macro_name
                current_expression = EXPRESSION_MAP.get(macro_value or 'NeutralRelaxed', 10)
            
            continue
        
        # Normale Textzeile
        clean_text, inline_links = extract_links_from_text(stripped)
        passage_links.extend(inline_links)
        if clean_text:
            current_text_parts.append(clean_text)
    
    # Speichere den letzten Text-Absatz
    if current_character is not None and current_text_parts:
        text = ' '.join(current_text_parts).strip()
        clean_text, inline_links = extract_links_from_text(text)
        passage_links.extend(inline_links)
        events.append({
            'type': 'dialog',
            'character': current_character,
            'expression': current_expression,
            'text': clean_text
        })
    
    return events, passage_links, passage_has_end


def generate_event_id(base, events):
    """Generiere eine einzigartige Event-ID."""
    existing = {e['id'] for e in events}
    if base not in existing:
        return base
    counter = 1
    while f"{base}_{counter}" in existing:
        counter += 1
    return f"{base}_{counter}"


def convert_passage_to_kite_events(passage, passage_map, all_events, start_passage, character_map, option_counter):
    """Konvertiert eine Passage in KITE-Events."""
    passage_name = passage['name']
    
    # Local character map
    local_char_map = {'Character1': 10, 'Character2': 11, 'Character3': 12, 'Notarin': 10, 'Player': 0, 'Info': 4}
    if character_map:
        local_char_map.update(character_map)
    
    # Verarbeite die Passage
    passage_events, passage_links, passage_has_end = process_passage(passage, start_passage)
    
    # Trenne die Events nach Typ
    dialogs = [e for e in passage_events if e['type'] == 'dialog']
    
    # Füge Dialog-Events hinzu
    for i, dialog in enumerate(dialogs):
        if i == 0:
            event_id = passage_name
        else:
            event_id = f"{passage_name}_{i}"
        
        event_id = generate_event_id(event_id, all_events)
        
        # Bestimme nextId
        next_id = None
        if i < len(dialogs) - 1:
            next_id = f"{passage_name}_{i+1}"
        elif passage_links:
            next_id = f"OptionsLabel{option_counter['next_label']}"
        elif passage_has_end:
            next_id = f"{passage_name}_End"
        
        # Mappe Character-Namen auf IDs
        char_id = local_char_map.get(dialog['character'], 10)
        
        all_events.append({
            'id': event_id,
            'nextId': next_id,
            'eventType': 4,
            'character': char_id,
            'text': dialog['text'],
            'expressionType': dialog['expression']
        })
    
    # Füge Option-Events hinzu
    if passage_links:
        # Finde das letzte Event dieser Passage
        last_event = None
        for e in reversed(all_events):
            if e['id'] == passage_name or e['id'].startswith(passage_name + '_'):
                last_event = e
                break
        
        if last_event:
            last_event['nextId'] = f"OptionsLabel{option_counter['next_label']}"
        
        # Erstelle alle Optionen
        current_label = option_counter['next_label']
        option_base = f"OptionsLabel{current_label}"
        
        for i, link in enumerate(passage_links):
            on_choice = link['target'] if link['target'] else link['text']
            
            if i == 0:
                option_id = option_base
            elif i == 1:
                option_id = option_base + option_base
            else:
                option_id = option_base + option_base * i
            
            # Bestimme nextId
            if i < len(passage_links) - 1:
                next_id = option_base + option_base * (i + 1)
            else:
                next_id = option_base + option_base * i + option_base
            
            all_events.append({
                'id': option_id,
                'nextId': next_id,
                'eventType': 5,
                'character': 0,
                'onChoice': on_choice,
                'text': link['text'],
                'expressionType': 0
            })
        
        # Show-Choices-Event (Typ 6)
        show_choices_id = option_base + option_base * (len(passage_links) - 1) + option_base
        all_events.append({
            'id': show_choices_id,
            'nextId': None,
            'eventType': 6,
            'character': 0,
            'expressionType': 0
        })
        
        # Inkrementiere Label-Counter
        option_counter['next_label'] += 1
    
    # End-Event
    if passage_has_end and not passage_links:
        end_event_id = generate_event_id(f"{passage_name}_End", all_events)
        all_events.append({
            'id': end_event_id,
            'eventType': 10,
            'character': 0,
            'expressionType': 0
        })
    
    return option_counter


def convert_novel(source_dir, append=False):
    """Konvertiert eine Novel aus Twee-Format in KITE-Format"""
    meta_file = os.path.join(source_dir, 'visual_novel_meta_data.txt')
    event_file = os.path.join(source_dir, 'visual_novel_event_list.txt')
    
    if not os.path.exists(meta_file):
        raise FileNotFoundError(f"Metadaten-Datei nicht gefunden: {meta_file}")
    if not os.path.exists(event_file):
        raise FileNotFoundError(f"Event-Datei nicht gefunden: {event_file}")
    
    # Parse Metadaten
    metadata = parse_metadata(meta_file)
    
    # Lade Character-Info
    char_name_to_id = load_character_info()
    
    # Ermittle Novel-Namen
    folder_name = os.path.basename(os.path.normpath(source_dir))
    novel_name = metadata.get('folderName', None)
    if not novel_name:
        novel_id = metadata.get('idNumberOfNovel', None)
        if novel_id:
            novel_name = str(novel_id)
    if not novel_name:
        novel_name = folder_name
    if 'folderName' not in metadata:
        metadata['folderName'] = novel_name
    
    # Character-Map
    character_map = {'Player': 0, 'Info': 4, 'Notarin': 10, 'Character1': 10, 'Character2': 8, 'Character3': 9}
    
    # Abbilde talkingPartner
    for i in range(1, 4):
        partner_key = f'talkingPartner{i:02d}'
        if partner_key in metadata and metadata[partner_key]:
            char_name = metadata[partner_key].strip()
            if char_name and char_name in char_name_to_id:
                character_map[f'Character{i}'] = char_name_to_id[char_name]
    
    # Novel-spezifische Mappings
    novel_specific = {
        'Einstieg': 2, 'Eltern': 7, 'Honorar': 12, 'Investor': 9,
        'Bank': 11, 'Kreditantrag': 10, 'Notarin': 10, 'Presse': 5, 'Vermieter': 6
    }
    if novel_name in novel_specific:
        character_map['Character1'] = novel_specific[novel_name]
    
    # Parse Passagen
    passages = parse_twee_passages(event_file)
    
    # Extrahiere Start-Passage
    with open(event_file, 'r', encoding='utf-8-sig') as f:
        content = f.read()
    
    story_data = None
    story_data_match = re.search(r':: StoryData\s*\n(.*?)\n\n', content, re.DOTALL)
    if story_data_match:
        try:
            story_data_str = story_data_match.group(1).strip()
            story_data = json.loads(story_data_str)
        except json.JSONDecodeError:
            pass
    
    start_passage = story_data.get('start', 'Anfang') if story_data else 'Anfang'
    
    # Konvertiere Passagen in Events
    all_events = []
    
    # InitialCharacterJoinsEvent
    expr_type = EXPRESSION_MAP.get(metadata.get('startTalkingPartnerExpression', 'NeutralRelaxed'), 10)
    all_events.append({
        'id': 'InitialCharacterJoinsEvent001',
        'nextId': start_passage,
        'eventType': 2,
        'character': character_map['Character1'],
        'expressionType': expr_type
    })
    
    # Option-Counter
    option_counter = {'next_label': 1}
    
    # Verarbeite start_passage zuerst
    start_passage_obj = None
    other_passages = []
    for passage in passages:
        if passage['name'] == start_passage:
            start_passage_obj = passage
        else:
            other_passages.append(passage)
    
    if start_passage_obj:
        option_counter = convert_passage_to_kite_events(
            start_passage_obj, {}, all_events, start_passage,
            character_map, option_counter
        )
    
    # Verarbeite andere Passagen
    for passage in other_passages:
        option_counter = convert_passage_to_kite_events(
            passage, {}, all_events, start_passage,
            character_map, option_counter
        )
    
    # Konvertiere letztes End-Event zu Typ 10
    end_events = [e for e in all_events if e.get('eventType') == 6]
    if end_events:
        end_events[-1]['eventType'] = 10
    
    # Erstelle Novel-Objekt
    novel = {
        'name': novel_name,
        'title': metadata.get('titleOfNovel', 'Unbekannte Novel'),
        'description': metadata.get('descriptionOfNovel', ''),
        'novelColor': metadata.get('novelColor', '#000000').lower(),
        'novelFrameColor': metadata.get('novelFrameColor', '#000000').lower(),
        'novelEvents': all_events
    }
    
    if metadata.get('isKiteNovel'):
        novel['isKiteNovel'] = True
    
    if 'disablePauseMenu' in metadata:
        novel['disablePauseMenu'] = metadata['disablePauseMenu']
    elif novel_name == 'Einstieg':
        novel['disablePauseMenu'] = True
    
    # Speichere in novels.json
    output_file = os.path.join(os.path.dirname(__file__), 'app', 'assets', 'json', 'novels.json')
    
    if append and os.path.exists(output_file):
        with open(output_file, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
        
        existing_novels = existing_data.get('visualNovels', [])
        novel_index = None
        for i, existing_novel in enumerate(existing_novels):
            if existing_novel.get('name') == novel['name']:
                novel_index = i
                break
        
        if novel_index is not None:
            existing_novels[novel_index] = novel
        else:
            existing_novels.append(novel)
        
        existing_data['visualNovels'] = existing_novels
        
        with open(output_file, 'w', encoding='utf-8', newline='\n') as f:
            json.dump(existing_data, f, indent=2, ensure_ascii=False)
        
        print(f"Novel '{novel['name']}' aktualisiert in {output_file}")
    else:
        data = {'visualNovels': [novel]}
        with open(output_file, 'w', encoding='utf-8', newline='\n') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Novel '{novel['name']}' nach {output_file} exportiert")
    
    print(f"  - {len(all_events)} Events generiert")
    
    return novel, all_events


def main():
    parser = argparse.ArgumentParser(description='Importiert eine Novel aus Twee-Format')
    parser.add_argument('source_dir', help='Verzeichnis mit visual_novel_meta_data.txt und visual_novel_event_list.txt')
    parser.add_argument('--append', '-a', action='store_true', help='Füge zur bestehenden novels.json hinzu')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.source_dir):
        print(f"Fehler: Verzeichnis nicht gefunden: {args.source_dir}")
        sys.exit(1)
    
    try:
        convert_novel(args.source_dir, append=args.append)
    except Exception as e:
        print(f"Fehler: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
