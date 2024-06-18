const SkewedInfiniteScroll = () => {
    const items = [
    { id: '1', text: 'ProdCollab' },
    { id: '2', text: 'ProdCollab' },
    { id: '3', text: 'ProdCollab' },
    { id: '4', text: 'ProdCollab' },
    { id: '5', text: 'ProdCollab' },
    { id: '6', text: 'ProdCollab' },
    { id: '7', text: 'ProdCollab' },
    { id: '8', text: 'ProdCollab' },
    { id: '9', text: 'ProdCollab' },
    { id: '10', text: 'ProdCollab' },
    { id: '11', text: 'ProdCollab' },
    { id: '12', text: 'ProdCollab' },
    ]
    return (
    
    <div>
    <div className="flex items-center justify-center">
    <div className="relative w-full max-w-screen-lg overflow-hidden">
    <div className="pointer-events-none absolute -top-1 z-10 h-20 w-full bg-gradient-to-b from-[#0A0A0B]"></div>
    <div className="pointer-events-none absolute -bottom-1 z-10 h-20 w-full bg-gradient-to-t from-[#0A0A0B]"></div>
    <div className="pointer-events-none absolute -left-1 z-10 h-full w-20 bg-gradient-to-r from-[#0A0A0B]"></div>
    <div className="pointer-events-none absolute -right-1 z-10 h-full w-20 bg-gradient-to-l from-[#0A0A0B]"></div>
    
          <div className="animate-skew-scroll mx-auto grid h-[250px] w-[300px] grid-cols-1 gap-5 sm:w-[600px] sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex cursor-pointer items-center space-x-2 rounded-xl border border-primary px-4 shadow-md transition-all hover:-translate-y-1 hover:translate-x-1 hover:scale-[1.025] hover:shadow-xl py-4"
              >
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.80981 11.967H43.2012M4.80981 31.0716H43.2012" stroke="#27272A" stroke-width="2.66606" stroke-linecap="round"/>
                <path d="M16.8071 40.6242V28.6838M16.8071 28.6838V21.5195C16.8071 17.5627 20.0298 14.3552 24.0055 14.3552C27.9811 14.3552 31.2039 17.5628 31.2039 21.5195C31.2039 25.4762 27.9811 28.6838 24.0055 28.6838H16.8071Z" stroke="white" stroke-width="3.33257"/>
                </svg>
                <p className="text-white">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    
    )
    }
    
    export default SkewedInfiniteScroll