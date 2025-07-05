import Image from "next/image";

export default function CompleteAdminProfile(){
    return(
        <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F4F6F8' }}>
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                {/* Organization Image */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F4F6F8' }}>
                        <Image src="/assets/OneTeamlogoFinal.jpeg" alt="logo" width={100} height={100} />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-center mb-6" style={{ color: '#0A66C2' }}>
                    Register Organisation
                </h1>

                {/* Organization Name Input */}
                <div className="mb-6">
                    <label htmlFor="orgName" className="block text-sm font-medium mb-2" style={{ color: '#0A66C2' }}>
                        Organization Name
                    </label>
                    <input
                        type="text"
                        id="orgName"
                        name="orgName"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200"
                        style={{ 
                            borderColor: '#F4F6F8',
                            backgroundColor: '#F4F6F8'
                        }}
                        placeholder="Enter your organization name"
                    />
                </div>

                {/* Register Button */}
                <button 
                    className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 mb-4 text-white"
                    style={{ backgroundColor: '#34A853' }}
                    onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#2d8f47'}
                    onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#34A853'}
                >
                    Register
                </button>

                {/* Switch Account Link */}
                <div className="text-center">
                    <a 
                        href="#" 
                        className="underline transition-colors duration-200"
                        style={{ color: '#0A66C2' }}
                        onMouseOver={(e) => (e.target as HTMLElement).style.color = '#084a8f'}
                        onMouseOut={(e) => (e.target as HTMLElement).style.color = '#0A66C2'}
                    >
                        Switch Account
                    </a>
                </div>
            </div>
        </main>
    )
}