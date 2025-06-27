export const usefulnessCounter = (userComments) => {

    for (let i = 0; i < userComments.length; i++) {
        if (userComments[i].usefulness) {
            const yes = userComments[i].usefulness.filter(({useful}) => useful === 'yes');
            const no = userComments[i].usefulness.filter(({ useful }) => useful === 'no');
            const isMongooseDoc = typeof userComments[i].toObject === 'function';
            const plainComment = isMongooseDoc ? userComments[i].toObject() : userComments[i];
            userComments[i] = { ...plainComment, yes: yes.length, no: no.length };
     }
    }

    return userComments;
}