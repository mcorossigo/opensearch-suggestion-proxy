module.exports = (req, res) => {
    res.setHeader('Cache-Control', 'Cache-Control: s-maxage=1, stale-while-revalidate')
    res.status(404).json([])
}
