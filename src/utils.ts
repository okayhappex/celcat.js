export const formatTitle = (title: string): { type: string, summary: string, module: string } => {
    let splitted = title.split(';');

    let subj: string = splitted[0]!.trim();
    let type: string;

    try {
        if (subj.includes('Entreprise')) {
            type = "Entreprise"
            subj = "Entreprise - Entreprise"
        } else if (splitted[1]!.includes('tutore')) {
            type = "Projet Tutoré";
        } else if (splitted[1]!.includes('DS')) {
            type = "DS"
        } else if (splitted[1]!.includes('Integration')) {
            type = "Integration"
        } else if (splitted[1]!.includes('Reunion')) {
            type = "Reunion"
        } else {
            type = splitted[1]!.split(' (')[1]!.slice(0, -1);
        }
    } catch {
        type = "inconnu",
        subj = title.trim()
    }

    let module = subj.split(' - ')[0]!;
    let summary = subj.split(' - ')[1]!;

    if (module.includes('tutore') || module.includes('autonomie')) {
        type = "Projet Tutoré";
        summary = "Projet Tutoré";
        module = "inconnu"
    }

    return { type: type, summary: summary, module: module };
}

export const formatDescription = (description: string): { teachers: string[] } => {
    let desc: string = description.split('\n\n')[0]!
    let teachers: string[] = desc.split('; ').filter((elem) => {
        return !(elem.startsWith('MMI') || elem.startsWith('RT') || elem.startsWith('INFO') || elem.startsWith('GEII'))
    })


    return { teachers: teachers }
}