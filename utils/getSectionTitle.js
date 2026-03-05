const getSectionTitle = (tag) => {
    if (!tag) return '';
    switch (tag.toLowerCase()) {
        case 'new':
            return 'အသစ်ရောက် ပစ္စည်းများ';
        case 'best seller':
            return 'ရောင်းအားအကောင်းဆုံး';
        case 'discount':
            return 'လျော့ဈေး ပစ္စည်းများ';
        default:
            return tag.charAt(0).toUpperCase() + tag.slice(1);
    }
};

export default getSectionTitle;
