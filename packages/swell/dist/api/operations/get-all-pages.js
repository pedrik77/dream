export default function getAllPagesOperation({ commerce  }) {
    async function getAllPages({ config: cfg , preview  } = {}) {
        var ref;
        const config = commerce.getConfig(cfg);
        const { locale , fetch  } = config;
        const data = await fetch('content', 'list', [
            'pages'
        ]);
        const pages = (data === null || data === void 0 ? void 0 : (ref = data.results) === null || ref === void 0 ? void 0 : ref.map(({ slug , ...rest })=>({
                url: `/${locale}/${slug}`,
                ...rest
            })
        )) ?? [];
        return {
            pages
        };
    }
    return getAllPages;
};
