interface Scripts {
    name: string;
    src: string;
}  
export const ScriptStore: Scripts[] = [
    {name: 'waveJS', src: '../../../assets/js/waves.min.js'},
    {name: 'staticJS', src: '../../../assets/js/static.js'},
    {name: 'mainJS', src: '../../../assets/js/mainforms.js'},
    {name: 'headerJS', src: '../../../assets/js/header.js'},
    {name: 'reviewJS', src: '../../../assets/js/review.js'},
    {name: 'd3JS', src: '../../../assets/js/d3.v3.min.js'},
    {name: 'popperJS', src: '../../../assets/js/popper.min.js'},
    {name: 'owlCJS', src: '../../../assets/js/owl.carousel.min.js'}
];