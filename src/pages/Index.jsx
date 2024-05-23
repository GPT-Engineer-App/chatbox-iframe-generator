import React, { useState } from 'react';
import { Box, Flex, Input, useToast } from '@chakra-ui/react';
import { marked } from 'marked';
import { create } from '../../lib/openai';

const Index = () => {
  const [inputValue, setInputValue] = useState('');
  const [iframeContent, setIframeContent] = useState('');
  const toast = useToast();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      toast({
        title: 'Input submitted.',
        description: `You entered: ${inputValue}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      try {
        const response = await create({
          messages: [{ role: 'user', content: inputValue }],
          model: 'gpt-4',
        });

        const generatedContent = response.choices[0].message.content;

        // Extract code within ``` blocks
        const codeBlocks = [];
        const regex = /```(?:\w+)?\n([\s\S]*?)```/g;
        let match;
        while ((match = regex.exec(generatedContent)) !== null) {
          codeBlocks.push(match[1]);
        }

        // Combine all code blocks into a single string
        const combinedCode = codeBlocks.join('\n');

        setIframeContent(combinedCode);
      } catch (error) {
        console.error('Error generating content:', error);
        toast({
          title: 'Error',
          description: 'There was an error generating the content.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      setInputValue('');
    }
  };

  return (
    <Flex height="100vh" direction={{ base: 'column', md: 'row' }}>
      <Box width={{ base: '100%', md: '25%' }} p={4} borderRight={{ base: 'none', md: '1px solid #ccc' }}>
        <Input
          placeholder="Type your message here..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          height="200px"
        />
      </Box>
      <Box width={{ base: '100%', md: '75%' }} p={4}>
        <iframe
          title="Output"
          style={{ width: '100%', height: '100%', border: 'none' }}
          srcDoc={iframeContent}
        />
      </Box>
    </Flex>
  );
};

export default Index;