import json
from pathlib import Path

novel_names = ["Einstieg", "Eltern", "Honorar", "Investor", "Bank", "Notarin", "Presse", "Vermieter"]

def transform_visual_novels(input_path, output_path):
    base_path = Path(__file__).parent.parent
    with open(base_path/input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    new_visual_novels = []
    
    index = 0
    for vn in data.get("visualNovels", []):
        new_vn = {}
        
        # Attribute 'name', 'title' und 'description' nur schreiben, falls sie nicht leer sind
        # (Sicherheitsüberprüfung hinzugefügt, um IndexError zu vermeiden, falls mehr Novels als Namen existieren)
        if index < len(novel_names):
            new_vn["name"] = novel_names[index]
            
        if vn.get("title"): 
            new_vn["title"] = vn["title"]
        if vn.get("description"): 
            new_vn["description"] = vn["description"]
        
        # Farbkonvertierung beibehalten (setzt voraus, dass diese Attribute im Ursprungs-JSON immer existieren)
        if "novelColor" in vn and "novelFrameColor" in vn:
            novelColor = vn["novelColor"]
            novelFrameColor = vn["novelFrameColor"]

            new_vn["novelColor"] = "#" + str(hex(round((novelColor["r"] * 255))))[2:].zfill(2) +  str(hex(round((novelColor["g"] * 255))))[2:].zfill(2) +  str(hex(round((novelColor["b"] * 255))))[2:].zfill(2)
            new_vn["novelFrameColor"] = "#" + str(hex(round((novelFrameColor["r"] * 255))))[2:].zfill(2) +  str(hex(round((novelFrameColor["g"] * 255))))[2:].zfill(2) +  str(hex(round((novelFrameColor["b"] * 255))))[2:].zfill(2)
        
        if vn["id"] == 13:
            new_vn["disablePauseMenu"] = True

        new_events = []
        for ev in vn.get("novelEvents", []):
            new_ev = {}
            
            if ev.get("id"): 
                new_ev["id"] = ev["id"]

            if ev.get("nextId"): 
                new_ev["nextId"] = ev["nextId"]
                
            # eventType ist ein Integer. Überprüfung auf 'is not None', da 0 valide ist.
            if ev.get("eventType") is not None: 
                new_ev["eventType"] = ev["eventType"]
                
            # character ist ein Integer. Explizite Überprüfung auf 'is not None', um ID 0 nicht zu verlieren.
            if ev.get("character") is not None:
                new_ev["character"] = ev["character"]
                
            # Logische Konjunktion: onChoice existiert nur bei eventType 5 UND darf nicht leer sein
            if ev.get("eventType") == 5 and ev.get("onChoice"):
                new_ev["onChoice"] = ev["onChoice"]

            if ev.get("eventType") == 16 and ev.get("relevantBias"):
                new_ev["relevantBias"] = ev["relevantBias"]
                
            if ev.get("text"): 
                new_ev["text"] = ev["text"]

            new_ev["expressionType"] = ev["expressionType"]
                
            new_events.append(new_ev)
        
        if vn["id"] == 2:
            new_events[0]["nextId"] = "InitialCharacterJoinsEvent002"
            insertedEvent = {}
            insertedEvent["id"] = "InitialCharacterJoinsEvent002"
            insertedEvent["nextId"] = "Anfang"
            insertedEvent["eventType"] = 2
            insertedEvent["character"] = 8
            insertedEvent["expressionType"] = 10
            new_events.insert(1, insertedEvent)

        if new_events:
            new_vn["novelEvents"] = new_events
            
        new_visual_novels.append(new_vn)
        
        index += 1
        
    new_data = {"visualNovels": new_visual_novels}

    
    with open(base_path/output_path, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, indent=4, ensure_ascii=False)

# Ausführen des Skripts
transform_visual_novels('novel_generation/novels_input.json', 'app/assets/json/novels.json')
print("Reformatting Completed")